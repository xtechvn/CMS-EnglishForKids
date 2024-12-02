using Microsoft.AspNetCore.Mvc;

namespace Web.CMS.Controllers.Course
{
    public class LessionController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
