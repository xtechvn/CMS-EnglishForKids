using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.ViewModels
{
    public class ItemDeleteViewModel
    {
        public int Id { get; set; } // ID của item cần xóa
        public string Type { get; set; } // Loại của item (Chapter, Lesson, ...)
    }
}
