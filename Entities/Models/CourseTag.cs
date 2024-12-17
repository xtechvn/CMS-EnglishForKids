using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models;

public partial class CourseTag
{
    public int Id { get; set; }

    public long? TagId { get; set; }
    [Column("SourceId")]
    public int? CourseId { get; set; }

    //public DateTime? UpdateLast { get; set; }

    public virtual Course Course { get; set; }

    public virtual Tag Tag { get; set; }
}
