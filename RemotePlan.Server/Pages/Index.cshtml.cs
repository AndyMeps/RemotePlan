using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Collections.Concurrent;
using RemotePlan.Server.Pages.Room;

namespace RemotePlan.Server.Pages
{
    public class IndexModel : PageModel
    {
        [FromQuery(Name = "errorCode")]
        public ErrorCode? ErrorCode { get; set; }

        private readonly ILogger<IndexModel> _logger;
        private readonly IHallMonitor _hallMonitor;

        public IndexModel(ILogger<IndexModel> logger, IHallMonitor hallMonitor)
        {
            _logger = logger;
            _hallMonitor = hallMonitor;
        }

        public void OnGet()
        {

        }

        public async Task<IActionResult> OnPost()
        {
            var submissionType = Request.Form["submit-type"].FirstOrDefault();

            if (submissionType == null)
                return Page();

            if (submissionType == "create")
            {
                int roomId;
                do
                {
                    roomId = Random.Shared.Next(0, 10000);
                } while (await _hallMonitor.RoomExistsAsync(roomId));

                var room = new Server.Room(roomId, DateTime.UtcNow.Add(TimeSpan.FromHours(3)));

                await _hallMonitor.CreateRoomAsync(room);

                return RedirectToPage("Room", new { RoomNumber = roomId });
            }

            if (submissionType == "join")
            {
                if (!int.TryParse(Request.Form["RoomId"].FirstOrDefault(), out var roomId))
                {
                    ErrorCode = Room.ErrorCode.InvalidRoomId;
                    return Page();
                }

                if (await _hallMonitor.RoomExistsAsync(roomId))
                    return RedirectToPage("Room", new { RoomNumber = roomId });

                ErrorCode = Room.ErrorCode.RoomNotFound;
                return Page();
            }

            return Page();
        }
    }
}