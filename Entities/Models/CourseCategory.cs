using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models;

public partial class CourseCategory
{
    public int Id { get; set; }

    public int? CategoryId { get; set; }
    [Column("SourceId")]
    public int? CourseId { get; set; }

    //public DateTime? UpdateLast { get; set; }
}
