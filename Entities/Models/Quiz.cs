using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class Quiz
    {
        public int Id { get; set; }
        [Column("SourceId")]
        public int CourseId { get; set; }
        public int ParentId { get; set; }

        public int? CreatedBy { get; set; }
        public string Title { get; set; }
        public int? IsDelete { get; set; }
        public int ChapterId { get; set; }
        public string Description { get; set; }
        public short? Order { get; set; }  // Đổi thành short nếu chưa đúng
        public string Thumbnail { get; set; }
        public short? Type { get; set; }   // Đổi thành short nếu chưa đúng
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }
    }

}
