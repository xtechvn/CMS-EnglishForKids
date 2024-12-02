using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models;

public partial class CourseRelated
{
    public int Id { get; set; }

    [Column("SourceId")]
    public int? CourseId { get; set; }

    [Column("SourceRelatedId")]
    public int? CourseRelatedId { get; set; }

    //public DateTime? UpdateLast { get; set; }

    public virtual Course Course { get; set; }
}
