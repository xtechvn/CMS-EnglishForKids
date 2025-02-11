using DAL.Generic;
using DAL.StoreProcedure;
using Entities.Models;
using Entities.Models;
using Entities.ViewModels;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using System.Data;
using System;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utilities;
using Utilities.Contants;
using Microsoft.EntityFrameworkCore;
using System.IO;

namespace DAL
{
    public class CourseDAL : GenericService<Course>
    {
        private static DbWorker _DbWorker;
        public CourseDAL(string connection) : base(connection)
        {
            _DbWorker = new DbWorker(connection);
        }

        public DataTable GetPagingList(CourseSearchModel searchModel, int currentPage, int pageSize)
        {
            try
            {
                DateTime _FromDate = DateTime.MinValue;
                DateTime _ToDate = DateTime.MinValue;
                string _ArrCategoryId = string.Empty;

                if (!string.IsNullOrEmpty(searchModel.FromDate))
                {
                    _FromDate = DateTime.ParseExact(searchModel.FromDate, "d/M/yyyy", null);
                }

                if (!string.IsNullOrEmpty(searchModel.ToDate))
                {
                    _ToDate = DateTime.ParseExact(searchModel.ToDate, "d/M/yyyy", null);
                }

                if (searchModel.ArrCategoryId != null && searchModel.ArrCategoryId.Length > 0)
                {
                    _ArrCategoryId = string.Join(",", searchModel.ArrCategoryId);
                }

                SqlParameter[] objParam = new SqlParameter[9];
                objParam[0] = new SqlParameter("@Title", searchModel.Title ?? string.Empty);
                objParam[1] = new SqlParameter("@SourceId", searchModel.CourseId);

                if (_FromDate != DateTime.MinValue)
                    objParam[2] = new SqlParameter("@FromDate", _FromDate);
                else
                    objParam[2] = new SqlParameter("@FromDate", DBNull.Value);

                if (_ToDate != DateTime.MinValue)
                    objParam[3] = new SqlParameter("@ToDate", _ToDate);
                else
                    objParam[3] = new SqlParameter("@ToDate", DBNull.Value);

                objParam[4] = new SqlParameter("@AuthorId", searchModel.AuthorId);
                objParam[5] = new SqlParameter("@Status", searchModel.Status);
                objParam[6] = new SqlParameter("@ArrCategoryId", _ArrCategoryId);
                //objParam[7] = new SqlParameter("@SearchType", searchModel.SearchType);
                objParam[7] = new SqlParameter("@CurentPage", currentPage);
                objParam[8] = new SqlParameter("@PageSize", pageSize);

                return _DbWorker.GetDataTable(ProcedureConstants.COURSE_SEARCH, objParam);
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("GetPagingList - CourseDAL: " + ex);
            }
            return null;
        }

        public async Task<int> SaveCourse(CourseModel model)
        {
            try
            {
                int courseId = model.Id;

                if (model.Id > 0)
                {
                    // Update existing course
                    var entity = await FindAsync(model.Id);

                    entity.Title = model.Title;
                    entity.Description = model.Description; // Updated to match the model
                    entity.Thumbnail = model.Thumbnail ?? string.Empty; // Assuming it's related to "Thumbnail"
                    entity.VideoIntro = model.VideoIntro ?? entity.VideoIntro; // Assuming it's related to "Thumbnail"

                    entity.Status = model.Status;
                    entity.Benefif = model.Benefif ?? string.Empty; // Fix potential typo: Benefit?
                    entity.Price = model.Price;
                    entity.OriginalPrice = model.OriginalPrice;
                    //entity.MainCategoryId = model.MainCategoryId;
                    //entity.SubCategoryId = model.SubCategoryId;
                    

                    entity.Type = model.Type;
                    entity.AuthorId = model.AuthorId;
                    //entity.CreatedBy = model.CreatedBy;
                    entity.CreatedDate = DateTime.Now;
                    //entity.UpdatedBy = model.UpdatedBy;
                    entity.UpdatedDate = DateTime.Now; // If updatedDate is null, use current date
                    entity.Position = model.Position;
                    entity.PublishDate = model.PublishDate == DateTime.MinValue ? (DateTime?)null : model.PublishDate;
                    entity.DownTime = model.DownTime == DateTime.MinValue ? (DateTime?)null : model.DownTime;

                    await UpdateAsync(entity);

                }
                else
                {
                    // Create new course
                    var entity = new Course
                    {
                        Title = model.Title,
                        Description = model.Description, // Updated to match the model
                        Thumbnail = model.Thumbnail ?? string.Empty, // Assuming it's related to "Thumbnail"
                        VideoIntro = model.VideoIntro ?? string.Empty, // Assuming it's related to "Thumbnail"

                        Status = model.Status,
                        Benefif = model.Benefif ?? string.Empty, // Fix potential typo: Benefit?
                        Price = model.Price,
                        OriginalPrice = model.OriginalPrice,
                        //MainCategoryId = model.MainCategoryId,
                        //SubCategoryId = model.SubCategoryId,

                        Type = model.Type,
                        AuthorId = model.AuthorId,
                        //CreatedBy = model.CreatedBy,
                        CreatedDate = DateTime.Now,
                        //UpdatedBy = model.UpdatedBy,
                        UpdatedDate = DateTime.Now, // If updatedDate is null, use current date
                        Position = model.Position,
                        //PublishDate = model.PublishDate == DateTime.MinValue ? (DateTime?)null : model.PublishDate,
                        //DownTime = model.DownTime == DateTime.MinValue ? (DateTime?)null : model.DownTime

                    };
                    courseId = await CreateAsyncCourse(entity);
                }
                return courseId;
            }
            catch (Exception ex)
            {
                // Log the error and rethrow or handle accordingly
                // LogHelper.InsertLogTelegram("Error while saving course: " + ex.Message);
                throw new Exception("Error while saving course: " + ex.Message, ex);
            }
        }

        public async Task UpdateVideoIntro(int courseId, string videoUrl)
        {
            using (var _DbContext = new EntityDataContext(_connection))
            {
                var course = await _DbContext.Course.FindAsync(courseId);
                if (course != null)
                {
                    course.VideoIntro = videoUrl;
                    course.UpdatedDate = DateTime.Now;
                    await _DbContext.SaveChangesAsync();
                }
            }
        }

        public async Task<int> SaveChapter(Chapters model)
        {

            int chapterId = model.Id;
            SqlParameter[] parameters;

            if (model.Id > 0) // Gọi SP Update
            {
                parameters = new SqlParameter[]
                {
            new SqlParameter("@Id", model.Id),
            new SqlParameter("@Title", model.Title ?? (object)DBNull.Value),
            
            new SqlParameter("@SourceId", model.CourseId),
            //new SqlParameter("@UpdatedBy", model.UpdatedBy ?? (object)DBNull.Value),
            //new SqlParameter("@Identity", SqlDbType.Int) { Direction = ParameterDirection.Output }
                };

                return _DbWorker.ExecuteNonQuery("sp_UpdateChapters", parameters);
            }
            else
            {
                parameters = new SqlParameter[]
        {
            new SqlParameter("@Title", model.Title ?? (object)DBNull.Value),
            
            new SqlParameter("@SourceId", model.CourseId),
            //new SqlParameter("@CreatedBy", model.CreatedBy ?? (object)DBNull.Value),
            //new SqlParameter("@Identity", SqlDbType.Int) { Direction = ParameterDirection.Output }
        };


                return _DbWorker.ExecuteNonQuery("sp_InsertChapters", parameters);
            }
            return Convert.ToInt32(parameters.Last().Value); // Lấy giá trị trả về từ @Identity


        }

        public async Task<int> SaveLession(Lessions model)
        {
            SqlParameter[] parameters;

            if (model.Id > 0) // Gọi SP Update
            {
                parameters = new SqlParameter[]
                {
            new SqlParameter("@Id", model.Id),
            new SqlParameter("@Title", model.Title ?? (object)DBNull.Value),
            new SqlParameter("@Author", model.Author ?? (object)DBNull.Value),
            new SqlParameter("@VideoDuration", model.VideoDuration ?? (object)DBNull.Value),
            new SqlParameter("@Thumbnail", model.Thumbnail ?? (object)DBNull.Value),
            new SqlParameter("@ThumbnailName", model.ThumbnailName ?? (object)DBNull.Value),

            new SqlParameter("@View", model.View),
            new SqlParameter("@ChapterId", model.ChapterId),
            //new SqlParameter("@UpdatedBy", model.UpdatedBy ?? (object)DBNull.Value),
            //new SqlParameter("@Identity", SqlDbType.Int) { Direction = ParameterDirection.Output }
                };

                return _DbWorker.ExecuteNonQuery("sp_UpdateLessions", parameters);
            }
            else // Gọi SP Insert
            {
                parameters = new SqlParameter[]
                {
            new SqlParameter("@Title", model.Title ?? (object)DBNull.Value),
            new SqlParameter("@Author", model.Author ?? (object)DBNull.Value),
            new SqlParameter("@VideoDuration", model.VideoDuration ?? (object)DBNull.Value),
            new SqlParameter("@Thumbnail", model.Thumbnail ?? (object)DBNull.Value),
            new SqlParameter("@ThumbnailName", model.ThumbnailName ?? (object)DBNull.Value),
            new SqlParameter("@View", model.View),
            new SqlParameter("@ChapterId", model.ChapterId),
            //new SqlParameter("@CreatedBy", model.CreatedBy ?? (object)DBNull.Value),
            //new SqlParameter("@Identity", SqlDbType.Int) { Direction = ParameterDirection.Output }
                };

                return _DbWorker.ExecuteNonQuery("sp_InsertLessions", parameters);
            }

            return Convert.ToInt32(parameters.Last().Value); // Lấy ID từ OUTPUT parameter
        }


        public async Task<bool> UpdateLessonAsync(Lessions lesson)
        {
            try
            {
                using (var _DbContext = new EntityDataContext(_connection))
                {
                    _DbContext.Lessions.Update(lesson);
                    await _DbContext.SaveChangesAsync();
                    return true;
                }
              
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram($"UpdateLessonAsync - LessonRepository: {ex}");
                return false;
            }
        }

        public async Task<Chapters> GetChapterByIdAsync(int id)
        {
            try
            {
                using (var _DbContext = new EntityDataContext(_connection))
                {
                    return await _DbContext.Chapters.FirstOrDefaultAsync(l => l.Id == id);
                }
            }
            catch (Exception ex)
            {
                // Ghi log hoặc xử lý ngoại lệ
                Console.WriteLine($"Error fetching lesson by ID: {ex.Message}");
                throw;
            }
        }
        public async Task<Lessions> GetLessonByIdAsync(int id)
        {
            try
            {
                using (var _DbContext = new EntityDataContext(_connection))
                {
                    return await _DbContext.Lessions.FirstOrDefaultAsync(l => l.Id == id);
                }
            }
            catch (Exception ex)
            {
                // Ghi log hoặc xử lý ngoại lệ
                Console.WriteLine($"Error fetching lesson by ID: {ex.Message}");
                throw;
            }
        }
        public DataTable GetFilesByLessonIds(List<int> lessonIds)
        {
            try
            {
                var idsParam = string.Join(",", lessonIds);
                SqlParameter[] objParam = new SqlParameter[]
                {
            new SqlParameter("@LessonIds", idsParam)
                };

                return _DbWorker.GetDataTable(StoreProcedureConstant.SP_GetAttachFilesByLessonId, objParam);
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("Error in GetFilesByLessonIds: " + ex);
                return null;
            }
        }


        public async Task<int> DeleteLessonAsync(int id)
        {

            try
            {
                using (var _DbContext = new EntityDataContext(_connection))
                {
                    using (var transaction = _DbContext.Database.BeginTransaction())
                    {
                        try
                        {
                           

                            var lession = await _DbContext.Lessions.FindAsync(id);
                            if (lession != null)
                            {
                                lession.IsDelete = 1; // Đánh dấu là đã xóa
                                _DbContext.SaveChanges(); // Lưu thay đổi
                            }

                            transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            LogHelper.InsertLogTelegram("DeleteLesson - Transaction Rollback " + ex);
                            transaction.Rollback();
                            return -1;
                        }
                    }
                }
                return id;
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("DeleteArticle - ArticleDAL: " + ex);
                return -1;
            }
        }

        public async Task<int> DeleteChapterAsync(int chapterId)
        {
            try
            {
                using (var _DbContext = new EntityDataContext(_connection))
                {
                    using (var transaction = _DbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            var chapter = await _DbContext.Chapters.FindAsync(chapterId);
                            if (chapter != null)
                            {
                                chapter.IsDelete = 1; // Đánh dấu là đã xóa
                                _DbContext.SaveChanges(); // Lưu thay đổi
                            }
                            transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            LogHelper.InsertLogTelegram("DeleteChapter - Transaction Rollback: " + ex);
                            transaction.Rollback();
                            return -1;
                        }
                    }
                }
                return chapterId;
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("DeleteChapter - Error: " + ex);
                return -1;
            }
        }

        public async Task<bool> DeleteArticleAsync(int lessonId)
        {
            try
            {
                using (var _DbContext = new EntityDataContext(_connection)) // 🔥 Tạo DbContext
                {
                    var lesson = await _DbContext.Lessions.FirstOrDefaultAsync(l => l.Id == lessonId);

                    if (lesson == null)
                        return false; // 🔥 Nếu không tìm thấy bài giảng, không cần xóa

                    lesson.Article = null; // 🔥 Xóa nội dung bài viết bằng cách đặt giá trị NULL
                    await _DbContext.SaveChangesAsync(); // 🔥 Lưu thay đổi vào DB

                    return true;
                }
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("Error in DeleteArticleAsync: " + ex);
                return false;
            }
        }



        public async Task<bool> DeleteFilesByLessonId(int lessonId, int fileType)
        {
            try
            {
                using (var _DbContext = new EntityDataContext(_connection))
                {
                    using (var transaction = _DbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            // 🔹 Lấy danh sách file cần xóa từ database
                            var files = await _DbContext.AttachFiles
                                .Where(f => f.DataId == lessonId && f.Type == fileType)
                                .ToListAsync();
                            if (files != null)
                            {
                               
                                // 🔹 Xóa dữ liệu file trong database
                                _DbContext.AttachFiles.RemoveRange(files);
                                await _DbContext.SaveChangesAsync(); // Lưu thay đổi vào DB
                                

                            }
                            transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            LogHelper.InsertLogTelegram("DeleteChapter - Transaction Rollback: " + ex);
                            transaction.Rollback();
                            return false;
                        }
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("DeleteChapter - Error: " + ex);
                return false;
            }
        }
        public async Task<List<Lessions>> GetLessonsByChapterIdAsync(int chapterId)
        {
            try
            {
                using (var _DbContext = new EntityDataContext(_connection))
                {
                    return await _DbContext.Lessions
                        .Where(l => l.ChapterId == chapterId)
                        .ToListAsync();
                }
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("GetLessonsByChapterIdAsync - Error: " + ex);
                throw;
            }
        }





        public async Task<CourseModel> GetCourseDetail(int Id)
        {
            try
            {
                var model = new CourseModel();
                using (var _DbContext = new EntityDataContext(_connection))
                {
                    using (var transaction = _DbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            var course = await _DbContext.Course.FindAsync(Id);
                            model = new CourseModel
                            {
                                Id = course.Id,
                                Title = course.Title,
                                Description = course.Description,
                                Price = course.Price,
                                OriginalPrice = course.OriginalPrice,
                                Benefif = course.Benefif,
                                Status = course.Status,
                                Type = course.Type,
                                Thumbnail = course.Thumbnail,
                                VideoIntro=course.VideoIntro,
                                CreatedDate = course.CreatedDate ?? DateTime.MinValue,
                                //DownTime = course.DownTime ?? DateTime.MinValue,
                                Position = course.Position ?? 0,
                               
                                //MainCategoryId = course.MainCategoryId,
                                //SubCategoryId = course.SubCategoryId,
                            };

                            var TagIds = await _DbContext.CourseTags.Where(s => s.CourseId == course.Id).Select(s => s.TagId).ToListAsync();
                            model.Tags = await _DbContext.Tags.Where(s => TagIds.Contains(s.Id)).Select(s => s.TagName).ToListAsync();
                            model.Categories = await _DbContext.CourseCategories.Where(s => s.CourseId == course.Id).Select(s => (int)s.CategoryId).ToListAsync();
                            model.RelatedCourseTagIds = await _DbContext.CourseRelateds.Where(s => s.CourseId == course.Id).Select(s => (int)s.CourseRelatedId).ToListAsync();

                            if (model.RelatedCourseTagIds != null && model.RelatedCourseTagIds.Count > 0)
                            {
                                model.RelatedCourseList = await (from _course in _DbContext.Course.AsNoTracking()
                                                                 join a in _DbContext.Users.AsNoTracking() on _course.AuthorId equals a.Id into cf
                                                                 from _user in cf.DefaultIfEmpty()
                                                                 where model.RelatedCourseTagIds.Contains(_course.Id)
                                                                 select new CourseRelationModel
                                                                 {
                                                                     Id = _course.Id,
                                                                     Author = _user.UserName,
                                                                     Image = _course.Thumbnail,
                                                                     Title = _course.Title
                                                                 }).ToListAsync();
                            }

                            transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            LogHelper.InsertLogTelegram("GetCourseDetail - Transaction Rollback - CourseDAL: " + ex);
                            transaction.Rollback();
                            return null;
                        }
                    }
                }
                return model;
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("GetCourseDetail - CourseDAL: " + ex);
                return null;
            }
        }

        public async Task<List<CategoryModel>> GetMainCategories()
        {
            using (var _DbContext = new EntityDataContext(_connection))
            {
                return await _DbContext.GroupProducts
                    .Where(c => c.ParentId == -1)
                    .Select(c => new CategoryModel { Id = c.Id, Name = c.Name })
                    .ToListAsync();
            }
        }

        public async Task<List<CategoryModel>> GetSubCategories(int parentId)
        {
            using (var _DbContext = new EntityDataContext(_connection))
            {
                return await _DbContext.GroupProducts
                    .Where(c => c.ParentId == parentId)
                    .Select(c => new CategoryModel { Id = c.Id, Name = c.Name })
                    .ToListAsync();
            }
        }

        public DataTable GetListChapterLessionBySourceId(int courseId)
        {
            try
            {
                SqlParameter[] objParam = new SqlParameter[1];
                objParam[0] = new SqlParameter("@SourceId", courseId);
                return _DbWorker.GetDataTable(StoreProcedureConstant.SP_GetListChapterLessionBySourceId, objParam);
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("GetByInvoiceId - InvoiceRequestDAL: " + ex);
            }
            return null;
        }


        public async Task<int> MultipleInsertCourseTag(int CourseId, List<long> ListTagId)
        {
            try
            {
                using (var _DbContext = new EntityDataContext(_connection))
                {
                    using (var transaction = _DbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            var ExistList = await _DbContext.CourseTags.Where(s => s.CourseId == CourseId).ToListAsync();
                            if (ExistList != null && ExistList.Count > 0)
                            {
                                foreach (var item in ExistList)
                                {
                                    var deleteModel = await _DbContext.CourseTags.FindAsync(item.Id);
                                    _DbContext.CourseTags.Remove(deleteModel);
                                    await _DbContext.SaveChangesAsync();
                                }
                            }

                            if (ListTagId != null && ListTagId.Count > 0)
                            {
                                foreach (var item in ListTagId)
                                {
                                    var model = new CourseTag
                                    {
                                        TagId = item,
                                        CourseId = CourseId,
                                        //UpdateLast = DateTime.Now
                                    };
                                    await _DbContext.CourseTags.AddAsync(model);
                                    await _DbContext.SaveChangesAsync();
                                }
                            }

                            transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            LogHelper.InsertLogTelegram("MultipleInsertCourseTag - Transaction Rollback - CourseDAL: " + ex);
                            transaction.Rollback();
                            return 0;
                        }
                    }
                }
                return 1;
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("MultipleInsertCourseTag - CourseDAL: " + ex);
                return 0;
            }
        }

        public async Task<int> MultipleInsertCourseCategory(int CourseId, List<int> ListCateId)
        {
            try
            {
                using (var _DbContext = new EntityDataContext(_connection))
                {
                    using (var transaction = _DbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            var ExistList = await _DbContext.CourseCategories.Where(s => s.CourseId == CourseId).ToListAsync();
                            if (ExistList != null && ExistList.Count > 0)
                            {
                                foreach (var item in ExistList)
                                {
                                    var deleteModel = await _DbContext.CourseCategories.FindAsync(item.Id);
                                    //deleteModel.UpdateLast = DateTime.Now;
                                    deleteModel.CategoryId = deleteModel.CategoryId * -1;
                                    deleteModel.CourseId = deleteModel.CourseId * -1;
                                    _DbContext.CourseCategories.Update(deleteModel);
                                    await _DbContext.SaveChangesAsync();
                                }
                            }

                            if (ListCateId != null && ListCateId.Count > 0)
                            { 
                                foreach (var item in ListCateId)
                                {
                                    var model = new CourseCategory
                                    {
                                        CategoryId = item,
                                        CourseId = CourseId,
                                        //UpdateLast = DateTime.Now
                                    };
                                    await _DbContext.CourseCategories.AddAsync(model);
                                    await _DbContext.SaveChangesAsync();
                                }
                            }

                            transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            LogHelper.InsertLogTelegram("MultipleInsertCourseCategory - Transaction Rollback - CourseDAL: " + ex);
                            transaction.Rollback();
                            return 0;
                        }
                    }
                }
                return 1;
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("MultipleInsertCourseCategory - CourseDAL: " + ex);
                return 0;
            }
        }

        public async Task<int> MultipleInsertCourseRelation(int CourseId, List<int> ListCourseId)
        {
            try
            {
                using (var _DbContext = new EntityDataContext(_connection))
                {
                    using (var transaction = _DbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            var ExistList = await _DbContext.CourseRelateds.Where(s => s.CourseId == CourseId).ToListAsync();
                            if (ExistList != null && ExistList.Count > 0)
                            {
                                foreach (var item in ExistList)
                                {
                                    var deleteModel = await _DbContext.CourseRelateds.FindAsync(item.Id);
                                    _DbContext.CourseRelateds.Remove(deleteModel);
                                    await _DbContext.SaveChangesAsync();
                                }
                            }

                            if (ListCourseId != null && ListCourseId.Count > 0)
                            {
                                foreach (var item in ListCourseId)
                                {
                                    var model = new CourseRelated
                                    {
                                        CourseRelatedId = item,
                                        CourseId = CourseId,
                                        //UpdateLast = DateTime.Now
                                    };
                                    await _DbContext.CourseRelateds.AddAsync(model);
                                    await _DbContext.SaveChangesAsync();
                                }
                            }

                            transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            LogHelper.InsertLogTelegram("MultipleInsertCourseRelation - Transaction Rollback - CourseDAL: " + ex);
                            transaction.Rollback();
                            return 0;
                        }
                    }
                }
                return 1;
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("MultipleInsertCourseRelation - CourseDAL: " + ex);
                return 0;
            }
        }

        //public async Task<long> DeleteCourse(long Id)
        //{
        //    try
        //    {
        //        using (var _DbContext = new EntityDataContext(_connection))
        //        {
        //            using (var transaction = _DbContext.Database.BeginTransaction())
        //            {
        //                try
        //                {
        //                    var ExistCategory = await _DbContext.CourseCategories.Where(s => s.CourseId == Id).ToListAsync();
        //                    if (ExistCategory != null && ExistCategory.Count > 0)
        //                    {
        //                        foreach (var item in ExistCategory)
        //                        {
        //                            var deleteModel = await _DbContext.CourseCategories.FindAsync(item.Id);
        //                            _DbContext.CourseCategories.Remove(deleteModel);
        //                            await _DbContext.SaveChangesAsync();
        //                        }
        //                    }

        //                    var ExistRelated = await _DbContext.CourseRelateds.Where(s => s.CourseId == Id).ToListAsync();
        //                    if (ExistRelated != null && ExistRelated.Count > 0)
        //                    {
        //                        foreach (var item in ExistRelated)
        //                        {
        //                            var deleteModel = await _DbContext.CourseRelateds.FindAsync(item.Id);
        //                            _DbContext.CourseRelateds.Remove(deleteModel);
        //                            await _DbContext.SaveChangesAsync();
        //                        }
        //                    }

        //                    var ExistTag = await _DbContext.CourseTags.Where(s => s.CourseId == Id).ToListAsync();
        //                    if (ExistTag != null && ExistTag.Count > 0)
        //                    {
        //                        foreach (var item in ExistTag)
        //                        {
        //                            var deleteModel = await _DbContext.CourseTags.FindAsync(item.Id);
        //                            _DbContext.CourseTags.Remove(deleteModel);
        //                            await _DbContext.SaveChangesAsync();
        //                        }
        //                    }

        //                    var course = await _DbContext.Courses.FindAsync(Id);
        //                    _DbContext.Courses.Remove(course);
        //                    await _DbContext.SaveChangesAsync();

        //                    transaction.Commit();
        //                }
        //                catch (Exception ex)
        //                {
        //                    LogHelper.InsertLogTelegram("DeleteCourse - Transaction Rollback - CourseDAL: " + ex);
        //                    transaction.Rollback();
        //                    return -1;
        //                }
        //            }
        //        }
        //        return Id;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.InsertLogTelegram("DeleteCourse - CourseDAL: " + ex);
        //        return -1;
        //    }
        //}
        ///// <summary>
        ///// cuonglv
        ///// Lấy ra danh sách các khóa học thuộc 1 chuyên mục
        ///// </summary>
        ///// <param name="cate_id"></param>
        ///// <returns></returns>
        //public async Task<List<CourseViewModel>> getCourseListByCategoryId(int cate_id)
        //{
        //    try
        //    {
        //        using (var _DbContext = new EntityDataContext(_connection))
        //        {
        //            using (var transaction = _DbContext.Database.BeginTransaction())
        //            {
        //                try
        //                {
        //                    var list_course = await (from _course in _DbContext.Courses.AsNoTracking()
        //                                             join a in _DbContext.CourseCategories.AsNoTracking() on _course.Id equals a.CourseId into cf
        //                                             from detail in cf.DefaultIfEmpty()
        //                                             where detail.CategoryId == cate_id && _course.Status == CourseStatus.PUBLISH
        //                                             select new CourseViewModel
        //                                             {
        //                                                 Id = detail.Id,
        //                                                 Title = _course.Title,
        //                                                 PublishDate = _course.PublishDate ?? DateTime.Now,
        //                                                 Lead = _course.Lead,
        //                                                 Body = _course.Body
        //                                             }
        //                                            ).ToListAsync();

        //                    transaction.Commit();
        //                    return list_course;
        //                }
        //                catch (Exception ex)
        //                {
        //                    LogHelper.InsertLogTelegram("getCourseListByCategoryId - Transaction Rollback - CourseDAL: " + ex);
        //                    transaction.Rollback();
        //                    return null;
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.InsertLogTelegram("getCourseListByCategoryId - CourseDAL: " + ex);
        //        return null;
        //    }
        //}

        ///// <summary>
        ///// cuonglv
        ///// Lấy ra chi tiết khóa học
        ///// </summary>
        ///// <param name="course_id"></param>
        ///// <returns></returns>
        //public async Task<CourseModel> GetCourseDetailLite(long course_id)
        //{
        //    try
        //    {
        //        using (var _DbContext = new EntityDataContext(_connection))
        //        {
        //            using (var transaction = _DbContext.Database.BeginTransaction())
        //            {
        //                try
        //                {
        //                    var course = await _DbContext.Courses.FirstOrDefaultAsync(x => x.Status == CourseStatus.PUBLISH && x.Id == course_id);
        //                    var model = new CourseModel
        //                    {
        //                        Id = course.Id,
        //                        Title = course.Title,
        //                        Lead = course.Lead,
        //                        Body = course.Body,
        //                        Status = course.Status,
        //                        CourseType = course.CourseType,
        //                        Image11 = course.Image11,
        //                        Image43 = course.Image43,
        //                        Image169 = course.Image169,
        //                        PublishDate = course.PublishDate ?? DateTime.Now,
        //                        DownTime = course.DownTime ?? DateTime.Now
        //                    };

        //                    transaction.Commit();
        //                    return model;
        //                }
        //                catch (Exception ex)
        //                {
        //                    LogHelper.InsertLogTelegram("GetCourseDetailLite - Transaction Rollback - CourseDAL: " + ex);
        //                    transaction.Rollback();
        //                    return null;
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.InsertLogTelegram("[course_id = " + course_id + "]GetCourseDetailLite - CourseDAL: " + ex);
        //        return null;
        //    }
        //}

        ///// <summary>
        ///// cuonglv
        ///// Lọc những khóa học theo title
        ///// </summary>
        ///// <param name="title"></param>
        ///// <returns></returns>
        //public async Task<List<CourseViewModel>> FindCourseByTitle(string title, int parent_cate_faq_id)
        //{
        //    try
        //    {
        //        using (var _DbContext = new EntityDataContext(_connection))
        //        {
        //            var list_course = await (from course in _DbContext.Courses.AsNoTracking()
        //                                     join a in _DbContext.CourseCategories on course.Id equals a.CourseId into cf
        //                                     from detail in cf.DefaultIfEmpty()
        //                                     where course.Status == CourseStatus.PUBLISH && course.Title.ToUpper().Contains(title.ToUpper())
        //                                     select new CourseViewModel
        //                                     {
        //                                         Id = detail.Id,
        //                                         Title = course.Title.Trim(),
        //                                         PublishDate = course.PublishDate ?? DateTime.Now,
        //                                         Lead = course.Lead.Trim(),
        //                                         Body = course.Body
        //                                     }
        //                                    ).ToListAsync();

        //            return list_course;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.InsertLogTelegram("[title = " + title + "] FindCourseByTitle - CourseDAL: " + ex);
        //        return null;
        //    }
        //}

        public async Task<List<int>> GetCourseCategoryIdList(int CourseId)
        {
            try
            {
                using (var _DbContext = new EntityDataContext(_connection))
                {
                    return await _DbContext.CourseCategories.Where(s => s.CourseId == CourseId).Select(s => (int)s.CategoryId).ToListAsync();
                }
            }
            catch
            {
                return new List<int>();
            }
        }

        ///// <summary>
        ///// minh.nq
        ///// Lấy ra danh sách các khóa học thuộc 1 chuyên mục, phân trang + sắp xếp theo ngày mới nhất
        ///// </summary>
        ///// <param name="cate_id"></param>
        ///// <returns></returns>
        //public async Task<CourseFEModelPagnition> getCourseListByCategoryIdOrderByDate(int cate_id, int skip, int take, string category_name)
        //{
        //    try
        //    {
        //        using (var _DbContext = new EntityDataContext(_connection))
        //        {
        //            using (var transaction = _DbContext.Database.BeginTransaction())
        //            {
        //                try
        //                {
        //                    var list_course = await (from _course in _DbContext.Courses.AsNoTracking()
        //                                             join a in _DbContext.CourseCategories.AsNoTracking() on _course.Id equals a.CourseId into cf
        //                                             from detail in cf.DefaultIfEmpty()
        //                                             where detail.CategoryId == cate_id && _course.Status == CourseStatus.PUBLISH
        //                                             orderby _course.PublishDate descending
        //                                             select new CourseFeModel
        //                                             {
        //                                                 category_name = category_name,
        //                                                 title = _course.Title,
        //                                                 lead = _course.Lead,
        //                                                 image_169 = _course.Image169,
        //                                                 image_43 = _course.Image43,
        //                                                 image_11 = _course.Image11,
        //                                                 publish_date = (DateTime)_course.PublishDate,
        //                                                 link = CommonHelper.genLinkNews(_course.Title, _course.Id.ToString())
        //                                             }
        //                                            ).ToListAsync();

        //                    var result = new CourseFEModelPagnition
        //                    {
        //                        list_course_fe = list_course.Skip(skip).Take(take).ToList(),
        //                        total_item_count = list_course.Count
        //                    };

        //                    transaction.Commit();
        //                    return result;
        //                }
        //                catch (Exception ex)
        //                {
        //                    LogHelper.InsertLogTelegram("getCourseListByCategoryIdOrderByDate - Transaction Rollback - CourseDAL: " + ex);
        //                    transaction.Rollback();
        //                    return null;
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.InsertLogTelegram("getCourseListByCategoryIdOrderByDate - CourseDAL: " + ex);
        //        return null;
        //    }
        //}

        ///// <summary>
        ///// Minh: Lấy ra khóa học được pinn trong thời gian
        ///// </summary>
        ///// <param name="cate_id"></param>
        ///// <param name="category_name"></param>
        ///// <param name="position"></param>
        ///// <returns></returns>
        //public async Task<CourseFeModel> getPinnedCourseByPosition(int cate_id, string category_name, int position)
        //{
        //    try
        //    {
        //        using (var _DbContext = new EntityDataContext(_connection))
        //        {
        //            using (var transaction = _DbContext.Database.BeginTransaction())
        //            {
        //                try
        //                {
        //                    var course = await (from _course in _DbContext.Courses.AsNoTracking()
        //                                        join a in _DbContext.CourseCategories.AsNoTracking() on _course.Id equals a.CourseId into cf
        //                                        from detail in cf.DefaultIfEmpty()
        //                                        where detail.CategoryId == cate_id && _course.Status == CourseStatus.PUBLISH && _course.UpTime <= DateTime.Now && DateTime.Now < _course.DownTime && _course.Position == position
        //                                        select new CourseFeModel
        //                                        {
        //                                            category_name = category_name,
        //                                            title = _course.Title,
        //                                            lead = _course.Lead,
        //                                            image_169 = _course.Image169,
        //                                            image_43 = _course.Image43,
        //                                            image_11 = _course.Image11,
        //                                            publish_date = (DateTime)_course.PublishDate,
        //                                            link = CommonHelper.genLinkNews(_course.Title, _course.Id.ToString())
        //                                        }
        //                                       ).FirstOrDefaultAsync();

        //                    transaction.Commit();
        //                    return course;
        //                }
        //                catch (Exception ex)
        //                {
        //                    LogHelper.InsertLogTelegram("getPinnedCourseByPosition - Transaction Rollback - CourseDAL: " + ex);
        //                    transaction.Rollback();
        //                    return null;
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.InsertLogTelegram("getPinnedCourseByPosition - CourseDAL: " + ex);
        //        return null;
        //    }
        //}

    }
}
