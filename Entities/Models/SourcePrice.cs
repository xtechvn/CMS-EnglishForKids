using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class SourcePrice
    {
        public int Id { get; set; }
        public int SourceId { get; set; }
        public double Price { get; set; }
        //public DateTime FromDate { get; set; }
        //public DateTime? ToDate { get; set; }
        //public short Status { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int? UpdatedBy { get; set; }
    }
}
