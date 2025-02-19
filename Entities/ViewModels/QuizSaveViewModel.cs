using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.ViewModels
{
    public class QuizSaveViewModel
    {
        public int QuizId { get; set; } // ID của câu hỏi (nếu cập nhật)
        public int ParentId { get; set; }
         public int CourseId { get; set; }
        public int QuestionId { get; set; } // 
        public string Description { get; set; } // Nội dung câu hỏi (Lưu vào cột Description của Quiz)
        public List<QuizAnswerViewModel> Answers { get; set; } // Danh sách các đáp án

        public QuizSaveViewModel()
        {
            Answers = new List<QuizAnswerViewModel>();
        }
    }

    public class QuizAnswerViewModel
    {
        public int Id { get; set; } // ID của đáp án
        public int QuizId { get; set; } // Quiz mà đáp án này thuộc về
        public string Description { get; set; } // Nội dung đáp án
        public string Note { get; set; } // Giải thích đáp án
        public bool IsCorrect { get; set; } // 1: Đáp án đúng, 0: Đáp án sai
        public int CreatedBy { get; set; } // Người tạo
    }
}
