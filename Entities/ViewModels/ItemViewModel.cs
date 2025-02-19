using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.ViewModels
{
    public class ItemViewModel
    {
        public int Id { get; set; } // ID của Item (0 nếu là thêm mới)
        public string Title { get; set; } // Tên của Item
        public string Type { get; set; } // Loại (Chapter, Lesson, Exam)
        public int ParentId { get; set; } // ID cha (ChapterId nếu là Lesson, LessonId nếu là Exam)
        public int CourseId { get; set; } // ID khóa học
        public string Description { get; set; } // Chỉ dùng cho Quiz
        public int Order { get; set; } // Chỉ dùng cho Quiz
        public int Status { get; set; } // Chỉ dùng cho Quiz


        // Các thuộc tính dành riêng cho Lesson
        public string Author { get; set; } // Tác giả của bài giảng
        public string VideoDuration { get; set; }
        public string Thumbnail { get; set; } // URL ảnh thu nhỏ
        public string ThumbnailName { get; set; } // Tên file ảnh thu nhỏ
    }

}
