using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models;
[Table("Sources")] // Ánh xạ class Course tới bảng Source trong DB
public partial class Course
{
    public int Id { get; set; }

    
    public string Title { get; set; }

    public string Description { get; set; }

    public string Thumbnail { get; set; } 
    public string VideoIntro { get; set; }


    public int Status { get; set; } // Assuming Status is a boolean, adjust if it's not.

    public string Benefif { get; set; } // Typo? Should it be "Benefit"?

    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }
    [Range(0, double.MaxValue)]
    public decimal OriginalPrice { get; set; }
    public int Type { get; set; }
    public int AuthorId { get; set; }


    public string CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }
    public DateTime? PublishDate { get; set; }

    public DateTime? DownTime { get; set; }

    public string UpdatedBy { get; set; }
    public DateTime? UpdatedDate { get; set; } // Nullable if update is not always done.
    public int? Position { get; set; }
    //public int MainCategoryId { get; set; }
    //public int? SubCategoryId { get; set; }

    public virtual ICollection<CourseRelated> CourseRelateds { get; set; } = new List<CourseRelated>();

    public virtual ICollection<CourseTag> CourseTags { get; set; } = new List<CourseTag>();
}
