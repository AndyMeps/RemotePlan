using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace RemotePlan.Server.Pages.Room
{
    public enum ErrorCode
    {
        RoomNotFound = 10001,
        InvalidRoomId = 10002,
    }

    public class IndexModel : PageModel
    {
        [BindProperty(SupportsGet = true)]
        public int RoomNumber { get; set; }

        private readonly IHallMonitor _hallMonitor;

        public IndexModel(IHallMonitor hallMonitor)
        {
            _hallMonitor = hallMonitor;
        }

        public async Task<IActionResult> OnGet()
        {
            if (!await _hallMonitor.RoomExistsAsync(RoomNumber))
                
                return RedirectToPage("Index", new { errorCode = ErrorCode.RoomNotFound });

            return Page();
        }
    }
}
