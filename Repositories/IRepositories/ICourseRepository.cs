using Entities.Models;
using Entities.ViewModels;
using Entities.ViewModels.Attachment;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Repositories.IRepositories
{
    public interface ICourseRepository
    {
        GenericViewModel<CourseViewModel> GetPagingList(CourseSearchModel searchModel, int currentPage, int pageSize);
            
        List<ChapterViewModel> GetListChapterLessionBySourceId(int courseId);
        List<ChapterViewModel> GetListChapterLessionQuizBySourceId(int courseId , int pageIndex, int pageSize);
        Task<Quiz> GetQuestionById(int questionId);
        Task<List<QuizAnswer>> GetAnswersByQuestionId(int questionIds);
        //Task<List<QuizAnswer>> GetAnswersByQuestionIds(List<int> questionIds);




        Task<int> SaveCourse(CourseModel model);
        Task UpdateVideoIntro(int courseId, string videoUrl);
        Task<int> SaveChapter(Chapters model);
        Task<int> SaveLesson(Lessions model);
        Task<int> SaveQuiz(Quiz model);
        Task<int> SaveQuizAnswer(QuizAnswer model);
        Task<int> UpdateQuizDescription(int quizId, string description);



        Task<bool> SaveArticleAsync(int lessonId, string article);

        
        Task<CourseModel> GetCourseDetail(int Id);
        Task<List<CategoryModel>> GetMainCategories();
        Task<List<CategoryModel>> GetSubCategories(int parentId);
        Task<Lessions> GetLessonByIdAsync(int id);
        Task<Chapters> GetChapterByIdAsync(int id);
        List<AttachFile> GetFilesByLessonIds(List<int> lessonIds);
        Task<bool> DeleteFilesByLessonId(int lessonId, int fileType);
        Task<int> DeleteLessonAsync(int id);
        Task<int> DeleteQuizAsync(int id);
        Task<int> DeleteQuizAnswers(int id);


        Task<bool> DeleteArticleAsync(int lessonId);

        Task<int> DeleteChapterAsync(int id);
        Task<List<Lessions>> GetLessonsByChapterIdAsync(int chapterid);
        Task<int> ChangeCourseStatus(int Id, int Status);
        //Task<List<string>> GetSuggestionTag(string name);
        //Task<List<CourseViewModel>> GetCourseListByCategoryId(int cate_id);
        //Task<CourseModel> GetCourseDetailLite(long course_id);
        //Task<List<CourseViewModel>> FindCourseByTitle(string title, int parent_cate_faq_id);
        Task<List<int>> GetCourseCategoryIdList(int Id);
        //Task<long> DeleteCourse(long Id);
        //Task<CourseFEModelPagnition> GetCourseListByCategoryIdOrderByDate(int cate_id, int skip, int take, string category_name);
        //Task<CourseFEModel> GetCourseDetailLiteFE(long course_id);
        //Task<CourseFEModel> GetPinnedCourseByPosition(int cate_id, string category_name, int position);
    }
}
