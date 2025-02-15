﻿using DAL;
using Entities.ConfigModels;
using Entities.Models;
using Entities.ViewModels;
using Entities.ViewModels.Attachment;
using Entities.ViewModels.Invoice;
using Microsoft.Extensions.Options;
using Nest;
using Repositories.IRepositories;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Mvc;
using Utilities;
using Utilities.Contants;


namespace Repositories.Repositories
{
    public class CourseRepository : ICourseRepository
    {
        private readonly CourseDAL _CourseDAL;
        private readonly TagDAL _TagDAL;

        private readonly string _UrlStaticImage;

        public CourseRepository(IOptions<DataBaseConfig> dataBaseConfig, IOptions<DomainConfig> domainConfig)
        {
            var _StrConnection = dataBaseConfig.Value.SqlServer.ConnectionString;
            _UrlStaticImage = domainConfig.Value.ImageStatic;
            _CourseDAL = new CourseDAL(_StrConnection);
            _TagDAL = new TagDAL(_StrConnection);
        }

        public GenericViewModel<CourseViewModel> GetPagingList(CourseSearchModel searchModel, int currentPage, int pageSize)
        {
            var model = new GenericViewModel<CourseViewModel>();
            try
            {
                DataTable dt = _CourseDAL.GetPagingList(searchModel, currentPage, pageSize); // Replace with your DAL method
                if (dt != null && dt.Rows.Count > 0)
                {
                    model.ListData = (from row in dt.AsEnumerable()
                                      select new CourseViewModel
                                      {
                                          Id = Convert.ToInt32(row["Id"]),
                                          Title = row["Title"].ToString(),
                                          //Description = row["Description"].ToString(),
                                          Thumbnail = string.IsNullOrWhiteSpace(row["Thumbnail"].ToString()) ? null : row["Thumbnail"].ToString(),
                                          Status = Convert.ToInt32(!row["Status"].Equals(DBNull.Value) ? row["Status"] : 0),
                                          //Benefif = row["Benefif"].ToString(), // Note: Correct the typo to "Benefit" in the database if possible.
                                          //Price = Convert.ToDecimal(!row["Price"].Equals(DBNull.Value) ? row["Price"] : 0),
                                          //OriginalPrice = Convert.ToDecimal(!row["OriginalPrice"].Equals(DBNull.Value) ? row["OriginalPrice"] : 0),
                                          //Type = Convert.ToInt32(!row["Type"].Equals(DBNull.Value) ? row["Type"] : 0),

                                          //CreatedBy = row["CreatedBy"].ToString(),
                                          CreatedDate = Convert.ToDateTime(!row["CreatedDate"].Equals(DBNull.Value) ? row["CreatedDate"] : DateTime.MinValue),
                                          //UpdatedBy = row["UpdatedBy"].ToString(),
                                          UpdatedDate = Convert.ToDateTime(!row["UpdatedDate"].Equals(DBNull.Value) ? row["UpdatedDate"] : null),
                                          AuthorId = Convert.ToInt32(!row["AuthorId"].Equals(DBNull.Value) ? row["AuthorId"] : 0),
                                          AuthorName = row["AuthorName"].ToString(),
                                          //Position = Convert.ToInt16(!row["Position"].Equals(DBNull.Value) ? row["Position"] : null),

                                          CourseCategoryName = row["CategoryName"].ToString(), // Additional fields if needed.
                                          StatusName = row["SourceStatusName"].ToString(),

                                      }).ToList();

                    model.CurrentPage = currentPage;
                    model.PageSize = pageSize;
                    model.TotalRecord = Convert.ToInt32(dt.Rows[0]["TotalRow"]);
                    model.TotalPage = model.TotalRecord > 0 ? (int)Math.Ceiling((double)model.TotalRecord / pageSize) : 0;
                }
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("GetPagingList - CourseRepository: " + ex);
            }
            return model;
        }
        public async Task<int> SaveCourse(CourseModel model)
        {
            try
            {
                Task<string> TBody;
                #region upload image
                if (model.Type == 0)
                {
                    // upload image inside content to static site
                    TBody = StringHelpers.ReplaceEditorImage(model.Benefif, _UrlStaticImage);
                    // upload thumb image via api

                    var T169 = UpLoadHelper.UploadBase64Src(model.Thumbnail, _UrlStaticImage);

                    await Task.WhenAll(TBody, T169);

                    model.Benefif = TBody.Result;

                    model.Thumbnail = T169.Result;
                }
                else
                {

                    var T169 = UpLoadHelper.UploadBase64Src(model.Thumbnail, _UrlStaticImage);
                    await Task.WhenAll(T169);

                    model.Thumbnail = T169.Result;
                }


                if (!string.IsNullOrEmpty(model.Thumbnail) && !model.Thumbnail.Contains(_UrlStaticImage))
                {
                    model.Thumbnail = _UrlStaticImage + model.Thumbnail;
                }
                #endregion


                #region date
                if (model.Status == CourseStatus.PUBLISH && model.CreatedDate == DateTime.MinValue)
                    model.PublishDate = DateTime.Now;

                //if (model.PublishDate != DateTime.MinValue && model.DownTime == DateTime.MinValue)
                //    model.DownTime = model.PublishDate.AddHours(1);
                #endregion

                var CourseId = await _CourseDAL.SaveCourse(model);

                if (CourseId > 0)
                {
                    if (CourseId > 0)
                    {
                        #region upsert Tags
                        var ListTagId = await _TagDAL.MultipleInsertTag(model.Tags);
                        await _CourseDAL.MultipleInsertCourseTag(CourseId, ListTagId);
                        #endregion

                        #region upsert Categories
                        await _CourseDAL.MultipleInsertCourseCategory(CourseId, model.Categories);
                        #endregion

                        #region upsert Relation Course
                        await _CourseDAL.MultipleInsertCourseRelation(CourseId, model.RelatedCourseTagIds);
                        #endregion
                    }
                }

                return CourseId;
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram($"[CMS] CourseRepository - SaveCourse: {ex}");
                return -1;
            }
        }

        public async Task UpdateVideoIntro(int courseId, string videoUrl)
        {
            // Gọi xuống DAL để cập nhật thông tin VideoIntro
            await _CourseDAL.UpdateVideoIntro(courseId, videoUrl);
        }

        public Task<int> SaveChapter(Chapters model)
        {
            try
            {
                return _CourseDAL.SaveChapter(model);
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("GetInvoiceRequests - InvoiceRequestRepository: " + ex);
                return null;
            }
        }

        public Task<int> SaveLesson(Lessions model)
        {
            try
            {
                return _CourseDAL.SaveLession(model);
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("GetInvoiceRequests - InvoiceRequestRepository: " + ex);
                return null;
            }
        }

        public async Task<bool> SaveArticleAsync(int lessonId, string article)
        {
            var lesson = await _CourseDAL.GetLessonByIdAsync(lessonId);
            if (lesson == null)
            {
                return false; // Không tìm thấy bài giảng
            }
            lesson.Article = article;
            var isUpdated = await _CourseDAL.UpdateLessonAsync(lesson);

            return true;

        }


        public List<ChapterViewModel> GetListChapterLessionBySourceId(int courseId)
        {
            try
            {
                var dataTable = _CourseDAL.GetListChapterLessionBySourceId(courseId);

                if (dataTable == null || dataTable.Rows.Count == 0)
                {
                    return new List<ChapterViewModel>();
                }

                // Ánh xạ dữ liệu từ DataTable sang List<ChapterViewModel>
                    var chapters = dataTable.AsEnumerable()
        .GroupBy(row => row.Field<int>("ChapterId"))
        .Select(group => new ChapterViewModel
        {
            Id = group.Key,
            Title = group.FirstOrDefault()?.Field<string>("ChapterTile"),
            IsDelete = group.FirstOrDefault()?.Field<int>("ChapterIsDelete"),


            //CourseId = group.FirstOrDefault()?.Field<int>("SourceId"), // Ánh xạ SourceId vào CourseId
            Lessons = group.Any(row => row.Field<int?>("LessionId") != null) // Kiểm tra nếu có ít nhất 1 lesson
                ? group.Where(row => row.Field<int?>("LessionId") != null).Select(row => new LessonViewModel
                {
                    Id = row.Field<int>("LessionId"),
                    Title = row.Field<string>("LessionTitle"),
                    Article = row.Field<string>("LessionArticle"),
                    IsDelete = row.Field<int>("LessionIsDelete"),
                    
                }).ToList()
                : new List<LessonViewModel>() // Nếu không có lesson nào, trả về danh sách rỗng
        }).ToList();    

                return chapters;


            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("GetInvoiceRequests - InvoiceRequestRepository: " + ex);
                return new List<ChapterViewModel>();
            }
        }
        public List<AttachFile> GetFilesByLessonIds(List<int> lessonIds)
        {
            if (lessonIds == null || lessonIds.Count == 0)
                return new List<AttachFile>();

            try
            {
                var dataTable = _CourseDAL.GetFilesByLessonIds(lessonIds);
                return dataTable.AsEnumerable().Select(row => new AttachFile
                {
                    Id = row.Field<long>("Id"),
                    DataId = row.Field<long>("DataId"),
                    UserId = row.Field<int>("UserId"),
                    Type = row.Field<int>("Type"),
                    Path = Path.GetFileName(row.Field<string>("Path")),
                    Ext = row.Field<string>("Ext"),
                    Capacity = row.Field<double>("Capacity"),
                    CreateDate = row.Field<DateTime>("CreateDate")
                }).ToList();
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("Error in GetFilesByLessonIds: " + ex);
                return new List<AttachFile>();
            }
        }


        public async Task<Chapters> GetChapterByIdAsync(int id)
        {
            return await _CourseDAL.GetChapterByIdAsync(id);
        }
        public async Task<Lessions> GetLessonByIdAsync(int id)
        {
            return await _CourseDAL.GetLessonByIdAsync(id);
        }
       

        public async Task<int> DeleteLessonAsync(int id)
        {

            return await _CourseDAL.DeleteLessonAsync(id);
        }

        public async Task<int> DeleteChapterAsync(int id)
        {
            return await _CourseDAL.DeleteChapterAsync(id);
        }

        public async Task<bool> DeleteArticleAsync(int lessonId)
        {
            return await _CourseDAL.DeleteArticleAsync(lessonId); 
        }
        public async Task<List<Lessions>> GetLessonsByChapterIdAsync(int chapterid)
        {
            return await _CourseDAL.GetLessonsByChapterIdAsync(chapterid);
        }
        public async Task<bool> DeleteFilesByLessonId(int lessonId, int fileType)
        {
            return await _CourseDAL.DeleteFilesByLessonId(lessonId , fileType);
        }



        public async Task<int> ChangeCourseStatus(int Id, int Status)
        {
            try
            {
                var model = await _CourseDAL.FindAsync(Id);
                model.Status = Status;

                if (Status == CourseStatus.PUBLISH)
                {
                    model.CreatedDate = DateTime.Now;
                    model.UpdatedDate = DateTime.Now;
                }

                await _CourseDAL.UpdateAsync(model);
                return Id;
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram($"[CMS] CourseRepository - ChangeCourseStatus: {ex}");
                return -1;
            }
        }

        //public async Task<long> DeleteCourse(long Id)
        //{
        //    try
        //    {
        //        var model = await _CourseDAL.FindAsync(Id);
        //        if (model != null)
        //        {
        //            await _CourseDAL.DeleteAsync(model);
        //            return Id;
        //        }
        //        return -1;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.InsertLogTelegram($"[CMS] CourseRepository - DeleteCourse: {ex}");
        //        return -1;
        //    }
        //}

        //public async Task<List<CourseViewModel>> FindCourseByTitle(string title, int parent_cate_faq_id)
        //{
        //    try
        //    {
        //        return await _CourseDAL.FindCourseByTitle(title, parent_cate_faq_id);
        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.InsertLogTelegram($"[CMS] CourseRepository - FindCourseByTitle: {ex}");
        //        return null;
        //    }
        //}



        //public async Task<CourseFEModel> GetPinnedCourseByPosition(int cate_id, string category_name, int position)
        //{
        //    try
        //    {
        //        return await _CourseDAL.GetPinnedCourseByPosition(cate_id, category_name, position);
        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.InsertLogTelegram($"[CMS] CourseRepository - GetPinnedCourseByPosition: {ex}");
        //        return null;
        //    }
        //}

        public async Task<List<int>> GetCourseCategoryIdList(int Id)
        {
            try
            {
                return await _CourseDAL.GetCourseCategoryIdList(Id);
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram($"[CMS] CourseRepository - GetCourseCategoryIdList: {ex}");
                return null;
            }
        }

        public async Task<CourseModel> GetCourseDetail(int Id)
        {
            try
            {
                return await _CourseDAL.GetCourseDetail(Id);
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram($"[CMS] CourseRepository - GetCourseDetail: {ex}");
                return null;
            }
        }
        public async Task<List<CategoryModel>> GetMainCategories()
        {
            try
            {
                return await _CourseDAL.GetMainCategories();
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram($"[CMS] CourseRepository - GetMainCategories: {ex}");
                return new List<CategoryModel>();
            }
        }

        public async Task<List<CategoryModel>> GetSubCategories(int parentId)
        {
            try
            {
                return await _CourseDAL.GetSubCategories(parentId);
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram($"[CMS] CourseRepository - GetSubCategories: {ex}");
                return new List<CategoryModel>();
            }
        }

       

















        //public async Task<CourseModel> GetCourseDetailLite(long course_id)
        //{
        //    try
        //    {
        //        return await _CourseDAL.GetCourseDetailLite(course_id);
        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.InsertLogTelegram($"[CMS] CourseRepository - GetCourseDetailLite: {ex}");
        //        return null;
        //    }
        //}

        //public async Task<CourseFEModel> GetCourseDetailLiteFE(long course_id)
        //{
        //    try
        //    {
        //        return await _CourseDAL.GetCourseDetailLiteFE(course_id);
        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.InsertLogTelegram($"[CMS] CourseRepository - GetCourseDetailLiteFE: {ex}");
        //        return null;
        //    }
        //}

        //public async Task<CourseFEModelPagnition> GetCourseListByCategoryIdOrderByDate(int cate_id, int skip, int take, string category_name)
        //{
        //    try
        //    {
        //        return await _CourseDAL.GetCourseListByCategoryIdOrderByDate(cate_id, skip, take, category_name);
        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.InsertLogTelegram($"[CMS] CourseRepository - GetCourseListByCategoryIdOrderByDate: {ex}");
        //        return null;
        //    }
        //}

        //public async Task<List<CourseViewModel>> GetCourseListByCategoryId(int cate_id)
        //{
        //    try
        //    {
        //        return await _CourseDAL.GetCourseListByCategoryId(cate_id);
        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.InsertLogTelegram($"[CMS] CourseRepository - GetCourseListByCategoryId: {ex}");
        //        return null;
        //    }
        //}

        //public async Task<List<string>> GetSuggestionTag(string name)
        //{
        //    try
        //    {
        //        return await _TagDAL.GetSuggestionTag(name);
        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.InsertLogTelegram($"[CMS] CourseRepository - GetSuggestionTag: {ex}");
        //        return null;
        //    }
        //}



        //public string ServerFile(CourseModel model)
        //{
        //    try
        //    {
        //        // Example logic to process and return the file path or URL
        //        return $"{_UrlStaticImage}/{model.FileName}";
        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.InsertLogTelegram($"[CMS] CourseRepository - ServerFile: {ex}");
        //        return null;
        //    }
        //}
    }
}
