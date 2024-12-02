using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class Lessions
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string VideoDuration { get; set; }
        public string Thumbnail { get; set; }
        public string ThumbnailName { get; set; }
        public int? FileIndex { get; set; } // Dùng để mapping file
        public int View { get; set; }
        public int ChapterId { get; set; } // Không có liên kết khóa ngoại
    }
}
