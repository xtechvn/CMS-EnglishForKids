using Entities.ViewModels.News;
using Entities.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Repositories.IRepositories;
using System.Security.Claims;
using Utilities.Common;
using Utilities.Contants;
using Utilities;
using WEB.CMS.Models;
using WEB.CMS.RabitMQ;
using WEB.CMS.Service.News;
using WEB.CMS.Customize;
using Entities.Models;
using Repositories.Repositories;
using Azure.Core;
using Caching.RedisWorker;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Text;
using Microsoft.AspNetCore.Hosting;

namespace Web.CMS.Controllers.Course
{
    [CustomAuthorize]
    public class CoursesController : Controller
    {
        private const int NEWS_CATEGORY_ID = 10;
        private const int VIDEO_NEWS_CATEGORY_ID = 1;
        private readonly IGroupProductRepository _GroupProductRepository;
        private readonly IArticleRepository _ArticleRepository;
        private readonly ICourseRepository _CourseRepository;
        private readonly IAttachFileRepository _AttachFileRepository;
        private readonly IUserRepository _UserRepository;
        private readonly ICommonRepository _CommonRepository;
        private readonly IWebHostEnvironment _WebHostEnvironment;
        private readonly IConfiguration _configuration;
        private readonly WorkQueueClient work_queue;
        private readonly QueueService _queueService;
        private readonly RedisConn _redisConn;
        private readonly int db_index = 13;

        public CoursesController(IConfiguration configuration, RedisConn redisConn, IArticleRepository articleRepository, IUserRepository userRepository, ICommonRepository commonRepository, IWebHostEnvironment hostEnvironment, QueueService queueService,
            IGroupProductRepository groupProductRepository, ICourseRepository courseRepository, IAttachFileRepository attachfileRepository)
        {
            _ArticleRepository = articleRepository;
            _CourseRepository = courseRepository;
            _CommonRepository = commonRepository;
            _UserRepository = userRepository;
            _AttachFileRepository = attachfileRepository;
            _WebHostEnvironment = hostEnvironment;
            _configuration = configuration;
            _GroupProductRepository = groupProductRepository;
            work_queue = new WorkQueueClient(configuration);
            _queueService = queueService;
            _redisConn = redisConn;
            _redisConn.Connect();


        }

        public async Task<IActionResult> Index()
        {
            var NEWS_CATEGORY_ID = Convert.ToInt32(_configuration["Config:default_news_root_group"]);
            ViewBag.ListArticleStatus = await _CommonRepository.GetAllCodeByType(AllCodeType.ARTICLE_STATUS);
            ViewBag.StringTreeViewCate = await _GroupProductRepository.GetListTreeViewCheckBox(NEWS_CATEGORY_ID, -1);
            ViewBag.ListAuthor = await _UserRepository.GetUserSuggestionList(string.Empty);
            return View();
        }

        /// <summary>
        /// Search News
        /// </summary>
        /// <param name="searchModel"></param>
        /// <param name="currentPage"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult Search(CourseSearchModel searchModel, int currentPage = 1, int pageSize = 20)
        {
            var model = new GenericViewModel<CourseViewModel>();
            try
            {
                model = _CourseRepository.GetPagingList(searchModel, currentPage, pageSize);
                ViewBag.ListID = (model != null && model.ListData != null && model.ListData.Select(x => x.Id).ToList() != null && model.ListData.Select(x => x.Id).ToList().Count > 0) ? JsonConvert.SerializeObject(model.ListData.Select(x => x.Id).ToList()) : "";
            }
            catch
            {

            }
            return PartialView(model);
        }

        public async Task<IActionResult> Detail(int Id)
        {
            var model = new CourseModel();
            var size_img = ReadFile.LoadConfig().SIZE_IMG;

            ViewBag.size_img = size_img;
            if (Id > 0)
            {
                model = await _CourseRepository.GetCourseDetail(Id);
                //if (model.MainCategoryId > 0)
                //{
                //    var subCategories = await _CourseRepository.GetSubCategories(model.MainCategoryId);
                //    ViewBag.SubCategories = subCategories; // Truyền xuống View
                //}
            }
            else
            {
                model.Status = ArticleStatus.SAVE;
            }
            //var NEWS_CATEGORY_ID = Convert.ToInt32(_configuration["Config:default_news_root_group"]);
            //ViewBag.StringTreeViewCate = await _GroupProductRepository.GetListTreeViewCheckBox(NEWS_CATEGORY_ID, -1, model.Categories);
            // Lấy danh mục chính
            //var mainCategories = await _CourseRepository.GetMainCategories();
            //ViewBag.MainCategories = mainCategories;
            ViewBag.MainCategories = await _CourseRepository.GetMainCategories();
            // Xác định danh mục cha và con đã chọn
            int? selectedParentId = null;
            int? selectedChildId = null;

            if (model.Categories != null && model.Categories.Any())
            {
                selectedParentId = model.Categories.Count > 1 ? model.Categories[0] : null; // Danh mục cha
                selectedChildId = model.Categories.LastOrDefault(); // Danh mục con
            }

            // Lấy danh mục con dựa vào danh mục cha
            ViewBag.ChildCategories = selectedParentId.HasValue
                ? await _CourseRepository.GetSubCategories(selectedParentId.Value)
                : new List<CategoryModel>();

            // Gán danh mục cha và con đã chọn
            ViewBag.SelectedParentCategory = selectedParentId;
            ViewBag.SelectedChildCategory = selectedChildId;

            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetSubCategories(int parentId)
        {
            var subCategories = await _CourseRepository.GetSubCategories(parentId);
            return Json(subCategories);
        }
        // Lưu Khóa Học(Course)
        [HttpPost]
        public async Task<IActionResult> UpSert([FromForm] string data, [FromForm] string button_type, IFormFile VideoIntro, [FromForm] string CurrentVideoPath)
        {
            try
            {
                // Thiết lập cài đặt Json để bỏ qua các giá trị null và các thành phần thiếu
                var settings = new JsonSerializerSettings
                {
                    NullValueHandling = NullValueHandling.Ignore,
                    MissingMemberHandling = MissingMemberHandling.Ignore
                };

                // Deserialize dữ liệu từ request body
                var model = JsonConvert.DeserializeObject<CourseModel>(data, settings);
                // Kiểm tra nếu chỉ cập nhật trạng thái thì bỏ qua kiểm tra dữ liệu bắt buộc
                bool isStatusUpdate = button_type == "status_update";

                // Lấy giá trị mặc định của NEWS_CATEGORY_ID từ cấu hình
                //var NEWS_CATEGORY_ID = Convert.ToInt32(_configuration["Config:default_news_root_group"]);

                // Nếu bài viết có danh mục và danh mục là GroupHeader, thêm NEWS_CATEGORY_ID vào danh mục
                //if (await _GroupProductRepository.IsGroupHeader(model.MainCategoryId))
                //{
                //    model.MainCategoryId.Add(NEWS_CATEGORY_ID);
                //}

                // Lấy thông tin AuthorId từ token người dùng đăng nhập
                if (model != null && HttpContext.User.FindFirst(ClaimTypes.NameIdentifier) != null)
                {
                    model.AuthorId = int.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
                }

                if (!isStatusUpdate)
                {
                    // Kiểm tra dữ liệu bắt buộc nếu đây là request cập nhật đầy đủ
                    model.Benefif = ArticleHelper.HighLightLinkTag(model.Benefif);
                    if (string.IsNullOrWhiteSpace(model.Benefif) || string.IsNullOrWhiteSpace(model.Title) || string.IsNullOrWhiteSpace(model.Description))
                    {
                        return new JsonResult(new { isSuccess = false, message = "Phần Tiêu đề, Mô tả và Nội dung bài viết không được để trống" });
                    }

                    if (model.Description.Length >= 400)
                    {
                        return new JsonResult(new { isSuccess = false, message = "Phần Mô tả không được vượt quá 400 ký tự" });
                    }
                }



                // Lưu bài viết và lấy ID của bài viết đã được lưu
                var courseId = await _CourseRepository.SaveCourse(model);


                // Kiểm tra xem quá trình lưu bài viết có thành công không
                if (courseId > 0)
                {
                    if (VideoIntro != null)
                    {


                        var fileUrl = await UpLoadHelper.UploadFileOrImage(VideoIntro, courseId, 35);
                        if (string.IsNullOrEmpty(fileUrl))
                        {
                            return new JsonResult(new { isSuccess = false, message = "Lỗi upload video." });
                        }

                        model.VideoIntro = fileUrl; // Cập nhật video mới vào model
                        await _CourseRepository.UpdateVideoIntro(courseId, fileUrl);
                    }
                    else if (!string.IsNullOrEmpty(CurrentVideoPath))
                    {
                        // Nếu không có video mới, giữ nguyên video cũ
                        model.VideoIntro = CurrentVideoPath;
                    }

                    // ✅ Gọi duy nhất 1 hàm lấy cả Chapter, Lesson và Quiz (chỉ lấy dữ liệu chưa bị xóa)
                    var chapters = _CourseRepository.GetListChapterLessionQuizBySourceId(courseId, 1, 100)
                                   .Where(ch => ch.IsDelete == 0)
                                   .ToList();
                    var lessons = chapters.SelectMany(ch => ch.Lessons).Where(l => l.IsDelete == 0).ToList();
                    var quizzes = chapters.SelectMany(ch => ch.Quizzes).Where(q => q.IsDelete == 0).ToList();

                    // ✅ Lấy danh sách LessonId để lấy file
                    var lessonIds = lessons.Select(l => l.Id).Distinct().ToList();
                    var allFiles = lessonIds.Any() ? _CourseRepository.GetFilesByLessonIds(lessonIds) : new List<AttachFile>();
                    var fileLookup = allFiles.GroupBy(f => f.DataId).ToDictionary(group => group.Key, group => group.ToList());

                    // ✅ Lấy danh sách QuizId để lấy QuizAnswer
                    //var quizIds = quizzes.Select(q => q.Id).Distinct().ToList();
                    //var quizAnswers = quizIds.Any() ? _CourseRepository.GetAnswersByQuestionIds(quizIds) : new List<QuizAnswer>();
                    // ✅ Lấy QuizAnswer bằng cách gọi nhiều lần với `int`
                    var quizAnswers = new List<QuizAnswer>();
                    foreach (var quiz in quizzes)
                    {
                        var answers = await _CourseRepository.GetAnswersByQuestionId(quiz.Id);
                        if (answers != null)
                        {
                            quizAnswers.AddRange(answers);
                        }
                    }

                    // ✅ Tạo Dictionary để map QuizAnswer theo QuizId
                    var quizAnswerLookup = quizAnswers.GroupBy(qa => qa.QuizId)
                                                      .ToDictionary(group => group.Key, group => group.ToList());

                    // ✅ Tạo dữ liệu Redis
                    var redisData = new
                    {
                        isSuccess = true,
                        source = new
                        {
                            SourceId = courseId,
                            SourceTitle = model.Title,
                            SourceDescription = model.Description,
                            SourceThumbnail = model.Thumbnail,
                            SourceBenefif = model.Benefif,
                            VideoIntro = model.VideoIntro,
                            Price = model.Price,
                            OriginalPrice = model.OriginalPrice,
                            Status = model.Status,
                        },
                        chapters = chapters.Select(chapter => new
                        {
                            ChapterId = chapter.Id,
                            ChapterTitle = chapter.Title,

                            // ✅ Xử lý lỗi Concat() bằng cách ép kiểu object
                            Items = lessons.Where(l => l.ChapterId == chapter.Id).Select(lesson => new
                            {
                                Type = "Lesson",
                                LessonId = lesson.Id,
                                LessonTitle = lesson.Title,
                                Author = lesson.Author,
                                Thumbnail = lesson.Thumbnail,
                                VideoDuration = lesson.VideoDuration,
                                Article = lesson.Article,

                                Files = fileLookup.ContainsKey(lesson.Id)
                                    ? fileLookup[lesson.Id].Select(f => new
                                    {
                                        FileId = f.Id,
                                        Type = f.Type,
                                        Path = f.Path,
                                        Ext = f.Ext,
                                        Duration =f.Duration
                                    }).Cast<object>().ToList()
                                    : new List<object>()
                            }).Select(x => (object)x) // ✅ Ép kiểu về object
                    .Concat(
                        quizzes.Where(q => q.ParentId == -1 && q.ChapterId == chapter.Id).Select(quiz => new
                        {
                            Type = "Quiz",
                            QuizId = quiz.Id,
                            Title = quiz.Title,
                            Questions = quizzes.Where(q => q.ParentId == quiz.Id).Select(q => new
                            {
                                QuestionId = q.Id,
                                Description = q.Description,
                                Answers = quizAnswerLookup.ContainsKey(q.Id)
                                    ? quizAnswerLookup[q.Id].Select(a => (object)new
                                    {
                                        AnswerId = a.Id,
                                        Description = a.Description,
                                        IsCorrect = a.IsCorrectAnswer,
                                        Note = a.Note
                                    }).ToList()
                                    : new List<object>()

                            }).ToList()
                        }).Select(x => (object)x) // ✅ Ép kiểu về object
                    ).ToList()
                        })
                    };




                    var redisJson = JsonConvert.SerializeObject(redisData);
                    // Xử lý trạng thái hiển thị
                    if (model.Status == 0) // Hiển thị
                    {
                        _redisConn.Set(CacheName.COURSE_DETAIL + model.Id, redisJson, db_index);
                    }
                    else if (model.Status == 2) // Ẩn
                    {
                        await _redisConn.DeleteCacheByKeyword(CacheName.COURSE_DETAIL + model.Id, db_index);
                    }
                    // Xóa cache của bài viết sau khi cập nhật
                    var strCategories = string.Empty;
                    if (model.Categories != null && model.Categories.Count > 0)
                        strCategories = string.Join(",", model.Categories);

                    ClearCacheArticle(courseId, strCategories);

                    var j_param = new Dictionary<string, object>
                                {
                                     { "store_name", "SP_GetAllSource" },
                                    { "index_es", "education_sp_get_source" },
                                    {"project_type", Convert.ToInt16(ProjectType.EDUCATION) },
                                      {"id" , -1 }

                                };
                    var _data_push = JsonConvert.SerializeObject(j_param);
                    // Push message vào queue
                    var response_queue = work_queue.InsertQueueSimple(_data_push, QueueName.queue_app_push);

                    // Trả về kết quả thành công với ID của bài viết
                    return new JsonResult(new
                    {
                        isSuccess = true,
                        message = "Cập nhật thành công",
                        dataId = courseId,
                        videoPath = model.VideoIntro

                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        isSuccess = false,
                        message = "Cập nhật thất bại"
                    });
                }
            }
            catch (Exception ex)
            {
                // Ghi log lỗi và trả về thông báo lỗi
                LogHelper.InsertLogTelegram("UpSert - NewsController: " + ex);
                return new JsonResult(new
                {
                    isSuccess = false,
                    message = ex.Message
                });
            }
        }

        public async Task<IActionResult> ChangeCourseStatus(int Id, int articleStatus)
        {
            try
            {
                var _ActionName = string.Empty;

                

                var rs = await _CourseRepository.ChangeCourseStatus(Id, articleStatus);

                // ✅ Xóa dữ liệu Redis khi hạ bài viết
                if (articleStatus == 1)
                {
                    await _redisConn.DeleteCacheByKeyword(CacheName.COURSE_DETAIL + Id, db_index);
                }

                if (rs > 0)
                {
                    //  clear cache article 
                    var Categories = await _CourseRepository.GetCourseCategoryIdList(Id);
                    ClearCacheArticle(Id, string.Join(",", Categories));

                    // Tạo message để push vào queue
                    //var j_param = new Dictionary<string, object>
                    //        {
                    //              { "store_name", "Sp_GetAllArticle" },
                    //            { "index_es", "es_hulotoys_sp_get_article" },
                    //            {"project_type", Convert.ToInt16(ProjectType.HULOTOYS) },
                    //              {"id" , Id }

                    //        };
                    //var _data_push = JsonConvert.SerializeObject(j_param);
                    //// Push message vào queue
                    //var response_queue = work_queue.InsertQueueSimple(_data_push, QueueName.queue_app_push);

                    return new JsonResult(new
                    {
                        isSuccess = true,
                        message = _ActionName + " thành công",
                        dataId = Id
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        isSuccess = false,
                        message = _ActionName + " thất bại"
                    });
                }
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("ChangeArticleStatus - NewsController: " + ex);
                return new JsonResult(new
                {
                    isSuccess = false,
                    message = ex.Message.ToString()
                });
            }
        }

        // Add Or Update của  Chapter và Leesion(Bài Viết)
        [HttpPost]
        public async Task<IActionResult> AddorUpdateItem([FromBody] ItemViewModel model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.Title))
                {
                    return Json(new { isSuccess = false, message = "Tên phần không được để trống!" });
                }
                int userid = Convert.ToInt32(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
                switch (model.Type)
                {
                    case "Chapter":
                        var chapterId = await _CourseRepository.SaveChapter(new Chapters
                        {
                            Id = model.Id,
                            Title = model.Title,
                            CourseId = model.CourseId,
                            CreatedDate = DateTime.Now,
                            CreatedBy = userid,
                            IsDelete = 0
                        });
                        break;

                    case "Lesson":
                        var lessonId = await _CourseRepository.SaveLesson(new Lessions
                        {
                            Id = model.Id,
                            Title = model.Title,
                            Author = model.Author,
                            VideoDuration = model.VideoDuration,
                            Thumbnail = model.Thumbnail,
                            ThumbnailName = model.ThumbnailName,
                            CreatedBy = userid,
                            ChapterId = model.ParentId,
                            IsDelete = 0
                        });
                        break;
                    case "Quiz":
                        var quizId = await _CourseRepository.SaveQuiz(new Quiz
                        {
                            Id = model.Id,
                            CourseId = model.CourseId,
                            Title = model.Title,
                            ChapterId = model.ParentId,
                            ParentId = -1,
                            //Thumbnail = model.Thumbnail,
                            CreatedBy = userid,
                            // Type = model.QuizType, // Nếu có nhiều loại Quiz
                            Status = model.Status,
                            CreatedDate = DateTime.Now,
                            IsDelete = 0
                        });
                        break;

                    default:
                        return Json(new { isSuccess = false, message = "Loại dữ liệu không hợp lệ!" });

                }




                return Json(new { isSuccess = true, message = "Thêm phần mới thành công!" });


            }
            catch (Exception ex)
            {
                return Json(new { isSuccess = false, message = "Đã xảy ra lỗi khi thêm phần mới!" });
            }
        }
        //Upload File Video Hoặc Tài Nguyên nằm trong Bài Giảng
        [HttpPost]
        public async Task<IActionResult> UploadFile(int lessonId, List<IFormFile> files, int duration = 0, bool isReplace = false, bool isResource = false)
        {
            try
            {
                if (lessonId <= 0 || files == null || !files.Any())
                {
                    return Json(new { isSuccess = false, message = "Dữ liệu không hợp lệ!" });
                }

                int userid = Convert.ToInt32(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
                // Nếu là thay thế video, xóa video cũ trước khi thêm mới
                if (isReplace)
                {
                    await _CourseRepository.DeleteFilesByLessonId(lessonId, 40); // 40: Loại video
                }

                int fileType = isResource ? 50 : 40; // 50: Tài nguyên, 40: Video

                var fileRecords = new List<AttachFile>();

                foreach (var file in files)
                {
                    // Kiểm tra loại file hợp lệ (Video chỉ nhận định dạng video)

                    var filePath = await UpLoadHelper.UploadFileOrImage(file, lessonId, fileType);
                    if (!string.IsNullOrEmpty(filePath))
                    {
                        // Tạo đối tượng AttachFile
                        var attachFile = new AttachFile
                        {
                            DataId = lessonId,
                            UserId = userid, // ID người dùng từ session hoặc token
                            Type = fileType, // Loại file, mặc định là 0
                            Path = filePath,
                            Ext = Path.GetExtension(filePath),
                            Capacity = file.Length,
                            CreateDate = DateTime.Now,
                            Duration = (fileType == 40) ? duration : 0 // ✅ Sử dụng duration từ client
                        };
                        // Lưu vào repository (kiểm tra và thêm mới nếu chưa tồn tại)
                        var fileId = await _AttachFileRepository.AddAttachFile(attachFile);
                        attachFile.Id = fileId; // Gán ID nếu đã tồn tại hoặc vừa thêm mới

                        fileRecords.Add(attachFile);
                    }
                }

                return Json(new { isSuccess = true, message = "Upload file thành công!", data = fileRecords });
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram($"UploadFile Error: {ex}");
                return Json(new { isSuccess = false, message = "Đã xảy ra lỗi khi upload file." });
            }
        }
        [HttpPost]
        // Lưu Bài Viết ,Bài Viết ngang hàng với Videoo và nằm trong Bìa Giảng
        public async Task<IActionResult> SaveArticle(int lessonId, string article)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(article))
                {
                    return Json(new { isSuccess = false, message = "Nội dung bài viết không được để trống!" });
                }

                var result = await _CourseRepository.SaveArticleAsync(lessonId, article);
                return Json(new
                {
                    isSuccess = result,
                    message = result ? "Bài viết đã được lưu!" : "Không thể lưu bài viết!"
                });


            }
            catch (Exception ex)
            {
                return Json(new { isSuccess = false, message = "Lỗi khi lưu bài viết!", error = ex.Message });
            }
        }
        // Lưu Câu Hỏi và Câu Trả lời
        [HttpPost]
        public async Task<IActionResult> SaveQuizAnswer([FromBody] QuizSaveViewModel model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.Description) || model.Answers == null || model.Answers.Count < 2)
                {
                    return Json(new { isSuccess = false, message = "Câu hỏi phải có ít nhất 2 đáp án!" });
                }

                int userId = Convert.ToInt32(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

                // ✅ Chỉ cập nhật `Description`, không ảnh hưởng đến `Title`
                //await _CourseRepository.UpdateQuizDescription(model.QuizId, model.Description);

                int questionId;

                if (model.QuestionId > 0) // ✅ Nếu đã có QuestionId, cập nhật nội dung câu hỏi
                {
                    var question = new Quiz
                    {
                        Id = model.QuestionId, // ✅ Update câu hỏi
                        ParentId = model.QuizId, // ✅ Thuộc về Quiz
                        Description = model.Description, // ✅ Nội dung câu hỏi mới
                        CourseId = model.CourseId,
                        ChapterId = model.ParentId,

                    };

                    questionId = await _CourseRepository.SaveQuiz(question); // ✅ Cập nhật câu hỏi
                                                                             // Xóa đáp án cũ
                    await _CourseRepository.DeleteQuizAnswers(questionId);
                }
                else // ✅ Nếu chưa có, tạo mới câu hỏi
                {
                    var question = new Quiz
                    {
                        Id = 0, // ✅ Tạo mới
                        ParentId = model.QuizId, // ✅ Thuộc về Quiz
                        CourseId = model.CourseId,
                        ChapterId = model.ParentId,
                        Description = model.Description, // ✅ Nội dung câu hỏi
                        CreatedBy = userId,
                        CreatedDate = DateTime.Now,
                        Status = 1 // Mặc định Active
                    };

                    questionId = await _CourseRepository.SaveQuiz(question); // ✅ Trả về ID mới của `Question`
                }

                //// ✅ Xóa đáp án cũ nếu cập nhật
                //await _CourseRepository.DeleteQuizAnswers(model.QuizId);

                // ✅ Lưu đáp án vào bảng `QuizAnswer`
                foreach (var answer in model.Answers)
                {
                    await _CourseRepository.SaveQuizAnswer(new QuizAnswer
                    {
                        QuizId = questionId,
                        Description = answer.Description,
                        Note = answer.Note,
                        IsCorrectAnswer = answer.IsCorrect,
                        CreatedBy = userId,
                        CreatedDate = DateTime.Now
                    });
                }
                // Lấy thông tin câu hỏi mới nhất để trả về
                var updatedQuestion = await _CourseRepository.GetQuestionById(questionId);

                return Json(new
                {
                    isSuccess = true,
                    questionId = questionId,
                    description = updatedQuestion.Description
                });
            }
            catch (Exception ex)
            {
                return Json(new { isSuccess = false, message = "Lỗi khi lưu trắc nghiệm!" });
            }
        }


        // Lây ra Toàn bộ Course, Chapter,Lession ,File, Quiz rồi Render ra trang
        public async Task<IActionResult> Chapters(int courseId, int pageIndex = 1, int pageSize = 10)
        {
            if (courseId <= 0)
            {
                return RedirectToAction("Detail");
            }

            // Gọi duy nhất 1 hàm để lấy cả Chapter, Lesson và Quiz
            var chapterLessons = _CourseRepository.GetListChapterLessionQuizBySourceId(courseId, pageIndex, pageSize);
            // Kiểm tra có dữ liệu không
            if (chapterLessons == null || !chapterLessons.Any())
            {
                return PartialView("Chapters", new List<ChapterViewModel>());
            }
            Console.WriteLine($"📌 Chapters: {chapterLessons.Count}");
            foreach (var chapter in chapterLessons)
            {
                Console.WriteLine($"🔍 Chapter {chapter.Id}: Lessons {chapter.Lessons.Count}, Quizzes {chapter.Quizzes.Count}");
            }

            // Tạo danh sách lessonId để truy vấn file
            var lessonIds = chapterLessons
                .SelectMany(chapter => chapter.Lessons.Select(lesson => lesson.Id))
                .Distinct()
                .ToList();

            // Lấy tất cả file của các lesson trong một lần gọi
            var allFiles = _CourseRepository.GetFilesByLessonIds(lessonIds);

            // Map file theo lessonId
            var fileLookup = allFiles.GroupBy(file => file.DataId).ToDictionary(group => group.Key, group => group.ToList());

            // Gán file vào từng lesson
            foreach (var chapter in chapterLessons)
            {
                foreach (var lesson in chapter.Lessons)
                {
                    lesson.Files = fileLookup.ContainsKey(lesson.Id) ? fileLookup[lesson.Id] : new List<AttachFile>();
                }
                // ✅ Đảm bảo `Quizzes` không null
                chapter.Quizzes ??= new List<QuizViewModel>();
            }

            ViewBag.CourseId = courseId;
            return PartialView("Chapters", chapterLessons);
        }

        [HttpGet]
        public async Task<IActionResult> GetQuizQuestion(int questionId)
        {
            try
            {
                var question = await _CourseRepository.GetQuestionById(questionId);

                if (question == null)
                {
                    return Json(new { isSuccess = false, message = "Câu hỏi không tồn tại!" });
                }

                var answers = await _CourseRepository.GetAnswersByQuestionId(questionId);
                answers = answers.OrderBy(a => a.Id).ToList();

                return Json(new
                {
                    isSuccess = true,
                    data = new
                    {
                        question = new { Id = question.Id, Description = question.Description },
                        answers = answers.Select(a => new
                        {
                            Id = a.Id,
                            Description = a.Description,
                            Note = a.Note,
                            IsCorrect = a.IsCorrectAnswer
                        })
                    }

                });
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram($"GetQuizQuestion - QuizController: {ex}");
                return Json(new { isSuccess = false, message = "Lỗi khi lấy dữ liệu câu hỏi!" });
            }
        }

        public async Task<IActionResult> RelationArticle(long Id)
        {
            var NEWS_CATEGORY_ID = Convert.ToInt32(_configuration["Config:default_news_root_group"]);
            ViewBag.StringTreeViewCate = await _GroupProductRepository.GetListTreeViewCheckBox(NEWS_CATEGORY_ID, -1);
            ViewBag.ListAuthor = await _UserRepository.GetUserSuggestionList(string.Empty);
            return PartialView();
        }



        [HttpPost]
        public async Task<IActionResult> DeleteArticle(int lessonId)
        {
            try
            {
                var result = await _CourseRepository.DeleteArticleAsync(lessonId); // Gọi đến Repository xóa bài viết
                return Json(new { isSuccess = result });
            }
            catch (Exception ex)
            {
                return Json(new { isSuccess = false, message = "Lỗi khi xóa bài viết!", error = ex.Message });
            }
        }


        [HttpPost]
        public async Task<IActionResult> DeleteResource(long fileId, long lessonId)
        {
            try
            {
                if (fileId <= 0 || lessonId <= 0)
                {
                    return Json(new { isSuccess = false, message = "Dữ liệu không hợp lệ!" });
                }

                // Lấy thông tin file
                var file = await _AttachFileRepository.GetAttachFileById(fileId);
                if (file == null || file.DataId != lessonId)
                {
                    return Json(new { isSuccess = false, message = "Không tìm thấy file!" });
                }



                // Xóa record trong database
                await _AttachFileRepository.DeleteAttachFile(fileId);

                return Json(new { isSuccess = true, message = "Xóa file thành công!" });
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram($"DeleteFile Error: {ex}");
                return Json(new { isSuccess = false, message = "Đã xảy ra lỗi khi xóa file." });
            }
        }





        [HttpPost]
        public IActionResult DeleteItem([FromBody] ItemDeleteViewModel model)
        {
            try
            {
                if (model.Type == "Chapter")
                {
                    _CourseRepository.DeleteChapterAsync(model.Id); // Gọi repository để xóa Chapter
                }
                else if (model.Type == "Lesson")
                {
                    _CourseRepository.DeleteLessonAsync(model.Id); // Gọi repository để xóa Lesson
                }
                else if (model.Type == "Quiz")
                {
                    _CourseRepository.DeleteQuizAsync(model.Id); // Gọi repository để xóa Quiz
                }
                else
                {
                    return Json(new { isSuccess = false, message = "Loại không hợp lệ!" });
                }

                return Json(new { isSuccess = true, message = $"{model.Type} đã được xóa thành công!" });
            }
            catch (Exception ex)
            {
                return Json(new { isSuccess = false, message = ex.Message });
            }
        }



        [HttpPost]
        public async Task<IActionResult> UpsertChapterAndLesson([FromForm] string chapters, [FromForm] List<IFormFile> files, [FromForm] List<string> fileKeys)
        {
            try
            {
                var model = JsonConvert.DeserializeObject<List<ChapterWithLessonsModel>>(chapters);
                if (model == null || !model.Any())
                {
                    return new JsonResult(new
                    {
                        isSuccess = false,
                        message = "Dữ liệu tiết học không được để trống!"
                    });
                }

                var createdBy = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                for (var chapterIndex = 0; chapterIndex < model.Count; chapterIndex++)
                {
                    var chapter = model[chapterIndex];

                    if (string.IsNullOrWhiteSpace(chapter.Title))
                    {
                        return new JsonResult(new
                        {
                            isSuccess = false,
                            message = "Tên tiết học không được để trống!"
                        });
                    }

                    // Lưu Chapter
                    var chapterId = await _CourseRepository.SaveChapter(new Chapters
                    {
                        Id = chapter.Id,
                        Title = chapter.Title,

                        CourseId = chapter.CourseId,
                        CreatedDate = DateTime.Now
                    });

                    // Lưu các bài giảng (Lessons) trong Chapter
                    if (chapterId > 0 && chapter.Lessions != null && chapter.Lessions.Any())
                    {
                        for (var lessonIndex = 0; lessonIndex < chapter.Lessions.Count; lessonIndex++)
                        {
                            var lesson = chapter.Lessions[lessonIndex];
                            var fileKey = $"chapter-{chapterIndex}-lesson-{lessonIndex}";

                            // Tìm file tương ứng với fileKey
                            var fileIndex = fileKeys.FindIndex(fk => fk == fileKey);
                            var file = (fileIndex >= 0 && fileIndex < files.Count) ? files[fileIndex] : null;

                            if (file != null)
                            {
                                // Upload file và gán đường dẫn vào lesson
                                var fileUrl = await UpLoadHelper.UploadFileOrImage(file, chapterId, 35);
                                lesson.Thumbnail = fileUrl;
                                lesson.ThumbnailName = file.FileName;
                            }

                            // Lưu bài giảng vào database
                            await _CourseRepository.SaveLesson(new Lessions
                            {
                                Id = lesson.Id,
                                Title = lesson.Title,
                                Author = lesson.Author,
                                VideoDuration = lesson.VideoDuration,
                                Thumbnail = lesson.Thumbnail,
                                ThumbnailName = lesson.ThumbnailName,
                                ChapterId = chapterId,
                                //CreatedDate = DateTime.Now
                            });
                        }
                    }
                }


                return new JsonResult(new
                {
                    isSuccess = true,
                    message = "Lưu tiết học và bài giảng thành công!"
                });
            }
            catch (Exception ex)
            {
                // Log lỗi nếu cần thiết
                Console.WriteLine($"UpsertChapterAndLesson Error: {ex.Message}");

                return new JsonResult(new
                {
                    isSuccess = false,
                    message = "Đã xảy ra lỗi khi lưu tiết học và bài giảng!"
                });
            }
        }


        public async Task<IActionResult> DeleteLesson(int id)
        {
            try
            {
                var lesson = await _CourseRepository.GetLessonByIdAsync(id); // Lấy thông tin bài giảng
                if (lesson == null)
                {
                    return Json(new
                    {
                        isSuccess = false,
                        message = "Bài giảng không tồn tại!"
                    });
                }
                var chapterId = lesson.ChapterId; // Lấy ChapterId của bài giảng

                await _CourseRepository.DeleteLessonAsync(id); // Xóa bài giảng
                                                               // Kiểm tra nếu chapter không còn bài giảng nào
                var remainingLessons = await _CourseRepository.GetLessonsByChapterIdAsync(chapterId);
                if (remainingLessons.Count == 0)
                {
                    await _CourseRepository.DeleteChapterAsync(chapterId); // Xóa chapter nếu không còn bài giảng
                    return Json(new
                    {
                        isSuccess = true,
                        message = "Bài giảng và chương liên quan đã được xóa!"
                    });
                }
                return Json(new
                {
                    isSuccess = true,
                    message = "Xóa bài giảng thành công!"
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    isSuccess = false,
                    message = "Đã xảy ra lỗi khi xóa bài giảng!"
                });
            }
        }

     
        public async Task<string> GetSuggestionTag(string name)
        {
            try
            {
                var tagList = await _ArticleRepository.GetSuggestionTag(name);
                return JsonConvert.SerializeObject(tagList);
            }
            catch
            {
                return null;
            }
        }





        [HttpPost]
        public IActionResult RelationSearch(ArticleSearchModel searchModel, int currentPage = 1, int pageSize = 10)
        {
            var model = new GenericViewModel<ArticleViewModel>();
            try
            {
                model = _ArticleRepository.GetPagingList(searchModel, currentPage, pageSize);
            }
            catch
            {

            }
            return PartialView(model);
        }




        public async Task<IActionResult> DeleteArticle(long Id)
        {
            try
            {
                var Categories = await _ArticleRepository.GetArticleCategoryIdList(Id);
                var rs = await _ArticleRepository.DeleteArticle(Id);

                if (rs > 0)
                {
                    //  clear cache article
                    ClearCacheArticle(Id, string.Join(",", Categories));
                    // Tạo message để push vào queue
                    //var j_param = new Dictionary<string, object>
                    //        {
                    //              { "store_name", "SP_GetAllArticle" },
                    //            { "index_es", "es_hulotoys_sp_get_article" },
                    //            {"project_type", Convert.ToInt16(ProjectType.HULOTOYS) },
                    //              {"id" , "-1" }

                    //        };
                    //var _data_push = JsonConvert.SerializeObject(j_param);
                    //// Push message vào queue
                    //var response_queue = work_queue.InsertQueueSimple(_data_push, QueueName.queue_app_push);

                    return new JsonResult(new
                    {
                        isSuccess = true,
                        message = "Xóa bài viết thành công",
                        dataId = Id
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        isSuccess = false,
                        message = "Xóa bài viết thất bại"
                    });
                }
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("DeleteArticle - NewsController: " + ex);
                return new JsonResult(new
                {
                    isSuccess = false,
                    message = ex.Message.ToString()
                });
            }
        }

        public async Task ClearCacheArticle(long articleId, string ArrCategoryId)
        {
            string token = string.Empty;
            try
            {
                var api = new APIService2(_configuration);
                var apiPrefix = ReadFile.LoadConfig().API_URL2 + ReadFile.LoadConfig().API_SYNC_COURSE;
                var key_token_api = ReadFile.LoadConfig().KEY_TOKEN_API;
                HttpClient httpClient = new HttpClient();
                var j_param = new Dictionary<string, string> {
                    { "course_id", articleId.ToString() },
                    { "category_id","-1" }
                };
                api.POST(_configuration["API:Api_get_list_by_course"], j_param);
                var category_list_id = ArrCategoryId.Split(",");
                foreach (var item in category_list_id)
                {
                    var j_param2 = new Dictionary<string, string> {
                        { "category_id", item },
                        { "skip","1" },
                        { "take","10" }
                    };
                    api.POST(_configuration["API:Api_get_list_by_categoryid_order"], j_param2);
                    api.POST(_configuration["API:Api_get_list_by_categoryid"], j_param2);
                }


            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("ClearCacheArticle - " + ex.ToString() + " Token:" + token);
            }
        }
        [HttpPost]
        public async Task<List<NewsViewCount>> GetPageViewByList(List<long> article_id)
        {
            try
            {
                NewsMongoService news_services = new NewsMongoService(_configuration);
                return await news_services.GetListViewedArticle(article_id);
            }
            catch
            {

            }
            return null;
        }
    }
}
