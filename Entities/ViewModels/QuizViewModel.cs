using Entities.Models;
using Entities.ViewModels.Attachment;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.ViewModels
{
    public class QuizViewModel
    {
        public int Id { get; set; }
        public int? CreatedBy { get; set; }
        public string Title { get; set; }
        public int? IsDelete { get; set; }
        public int ChapterId { get; set; }
        public string Description { get; set; }
        public int? ParentId { get; set; }
        public short? Order { get; set; }  // Đổi thành short nếu chưa đúng
        public string Thumbnail { get; set; }
        public short? Type { get; set; }   // Đổi thành short nếu chưa đúng
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }
        // ✅ Danh sách đáp án
        public List<QuizAnswerViewModel> Answers { get; set; }

        // ✅ Constructor khởi tạo danh sách tránh lỗi null
        public QuizViewModel()
        {
            Answers = new List<QuizAnswerViewModel>();
        }
    }

}
