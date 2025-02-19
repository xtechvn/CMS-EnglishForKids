using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class QuizAnswer
    {
        public int Id { get; set; }
        public int QuizId { get; set; } // ID của Quiz (Câu hỏi trắc nghiệm)
        public int? CreatedBy { get; set; }
        //public int? IsDelete { get; set; }
        public string Description { get; set; } // Nội dung đáp án
        public short? Order { get; set; } // Thứ tự của đáp án
        public string Thumbnail { get; set; } // Ảnh đáp án (nếu có)
        public int Status { get; set; } // Trạng thái đáp án (Đang sử dụng, Ẩn, ...)
        public bool IsCorrectAnswer { get; set; } // 1: Là đáp án đúng, 0: Sai
        public string Note { get; set; } // Giải thích lý do đáp án đúng/sai
       
        public DateTime CreatedDate { get; set; } // Ngày tạo đáp án
        public int? UpdatedBy { get; set; } // ID người cập nhật
        public DateTime? UpdatedDate { get; set; } // Ngày cập nhật đáp án
    }

}
