using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class ChapterWithLessonsModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        [Column("SourceId")]
        public int CourseId { get; set; }
        public List<Lessions> Lessions { get; set; }
    }
}
