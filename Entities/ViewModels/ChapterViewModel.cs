using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.ViewModels
{
    public class ChapterViewModel
    {
        public int Id { get; set; } // Id của Chapter

        public int CourseId { get; set; } // Id của khóa học mà Chapter thuộc về
        public string Title { get; set; } // Tên của Chapter
        public string Description { get; set; }
        public int Order { get; set; } // Thứ tự của Chapter trong khóa học
        public List<LessonViewModel> Lessons { get; set; } // Danh sách các bài giảng trong Chapter

        public ChapterViewModel()
        {
            Lessons = new List<LessonViewModel>();
        }
    }

}
