using Entities.ViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Entities.Models;

public class Chapters
{
    [Key]
    public int Id { get; set; }

    [Required]  
    [StringLength(255)]
    public string Title { get; set; }

    public string Description { get; set; }

    [Column("SourceId")]
    public int CourseId { get; set; }

    public string CreatedBy { get; set; }

    public DateTime CreatedDate { get; set; }

    public string UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; } // Nullable nếu không phải lúc nào cũng được cập nhật.


}
