using Entities.Models;
using Entities.ViewModels.Attachment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.ViewModels
{
    public class LessonViewModel
    {
        public int Id { get; set; } // Id của Lesson
        public int ChapterId { get; set; } // Id của Chapter mà Lesson thuộc về
        public string Title { get; set; } // Tên của Lesson
        public string Type { get; set; } // Loại Lesson (Video/File/Text, etc.)
        public string VideoDuration { get; set; } // Thời lượng bài giảng (vd: "1 giờ 20 phút")
        public string Thumbnail { get; set; }
        public string ThumbnailName { get; set; }
        public int? IsDelete { get; set; }

        public List<AttachFile> Files { get; set; }

        public int View {  get; set; }
        public  string Author { get; set; }

        public string ContentUrl { get; set; } // URL của bài giảng (nếu là Video hoặc File)
    }

}
