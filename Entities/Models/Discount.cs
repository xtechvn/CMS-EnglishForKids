using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Entities.Models;

public class Discount
{
    [Key]
    public int Id { get; set; }

    [Required]
    [Range(0, double.MaxValue, ErrorMessage = "PriceDiscount must be a positive number.")]
    public decimal PriceDiscount { get; set; }

    [Required]
    [ForeignKey("Course")] // Thiết lập khóa ngoại đến bảng Course
    public int CourseId { get; set; }

    public string CreatedBy { get; set; }

    public DateTime CreatedDate { get; set; }

    public string UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; } // Nullable nếu không phải lúc nào cũng cập nhật

    // Navigation Property (Liên kết tới bảng Course)
    public virtual Course Course { get; set; }
}
