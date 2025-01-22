namespace Web.CMS.ViewComponents;
using Entities.ViewModels;
using Microsoft.AspNetCore.Mvc;
public class CourseViewComponent : ViewComponent
{
    public IViewComponentResult Invoke(CourseModel model)
    {
        return View("Default", model);
    }
}
