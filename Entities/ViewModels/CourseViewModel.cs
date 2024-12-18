using Entities.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.ViewModels
{
    public  class CourseViewModel : Course {

        public string CourseCategoryName { get; set; }
        public string AuthorName { get; set; }
        public string StatusName { get; set; } // Chuyển Status thành mô tả
    }
    // Search Model cho việc tìm kiếm nguồn (Source)

    public class CourseModel
    {
      
        public int Id { get; set; }

        
        public string Title { get; set; }

        public string Description { get; set; }

        public string Thumbnail { get; set; }
        public string VideoIntro { get; set; }

        public int Status { get; set; } // Giả sử Status là boolean

        public string Benefif { get; set; } // Kiểm tra lỗi chính tả (Benefit?)

       
        public decimal Price { get; set; }
        public decimal OriginalPrice { get; set; }
        


        public int SubTopicId { get; set; }

        public int Type { get; set; }


        public int AuthorId { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public string UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; } // Nullable nếu không cập nhật


        public List<string> Tags { get; set; }
        public List<int> Categories { get; set; }
        public List<int> RelatedCourseTagIds { get; set; }
        public List<CourseRelationModel> RelatedCourseList { get; set; }
        public DateTime PublishDate { get; set; }
        
        public DateTime? DownTime { get; set; }
        public int Position { get; set; }
    }
    public class CourseRelationModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string Image { get; set; }
    }
    public class CourseSearchModel
    {
        public string Title { get; set; }
        public long CourseId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int AuthorId { get; set; }
        public int Status { get; set; }
        public int[] ArrCategoryId { get; set; }

        /// <summary>
        /// 0:Basic | 1:Advance
        /// </summary>
        public int SearchType { get; set; }
    }

    // Model hiển thị cho Source khi xuất ra frontend hoặc khi cần thao tác nhanh
    public class CourseFEModel
    {
        public string Link { get; set; }
        public string CategoryName { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Thumbnail { get; set; }
        public decimal Price { get; set; }
        public decimal OriginalPrice { get; set; }
        public int Type { get; set; }
        public bool Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public string AuthorName { get; set; }
        public short? postition { get; set; }
    }
    public class CourseFEModelPagnition
    {
        public List<CourseFEModel> list_source_fe { get; set; }
        public int total_item_count { get; set; }
    }
}
