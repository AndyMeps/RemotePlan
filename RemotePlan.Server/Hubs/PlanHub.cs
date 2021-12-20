using Microsoft.AspNetCore.SignalR;
using System.Text.Json;

namespace RemotePlan.Server.Hubs
{
    public class PlanHub : Hub
    {
        private readonly ILogger<PlanHub> _log;
        private readonly IHallMonitor _hallMonitor;
        public PlanHub(ILogger<PlanHub> log, IHallMonitor hallMonitor)
        {
            _log = log;
            _hallMonitor = hallMonitor;
        }

        public override Task OnConnectedAsync()
        {
            _log.LogDebug("{ConnectionId} Connected.", this.Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var result = await _hallMonitor.RemoveClientFromRoomsAsync(Context.ConnectionId);

            foreach (var room in result)
            {
                await Clients.Group(room.ToString()).SendAsync("PlayerLeft", new Player(Context.ConnectionId, null));
            }
        }

        public async Task Vote(string roomId, string choice)
        {
            var voteResult = await _hallMonitor.ClientVoteAsync(Convert.ToInt32(roomId), Context.ConnectionId, choice);

            await Clients.Group(roomId).SendAsync("PlayerVoted", voteResult);

            var intRoomId = Convert.ToInt32(roomId);
            if (await _hallMonitor.AllVotesCastAsync(intRoomId))
            {
                var room = await _hallMonitor.GetRoomInformationAsync(intRoomId);
                await Clients.Group(roomId).SendAsync("AllVoted", room);
            }
        }

        public async Task<Room> StartNewHand(string roomId)
        {
            var result = await _hallMonitor.StartNewHandAsync(Convert.ToInt32(roomId));

            await Clients.Group(roomId).SendAsync("NewHand", result);

            return result;
        }

        public async Task<Player> SetInitials(string roomId, string initials)
        {
            var result = await _hallMonitor.SetPlayerInitialsAsync(Convert.ToInt32(roomId), Context.ConnectionId, initials);

            await Clients.Group(roomId).SendAsync("PlayerInitialsSet", result);

            return result;
        }

        public async Task<Room?> JoinRoom(string roomId, string? initials = null)
        {
            var newPlayer = new Player(Context.ConnectionId, initials);
            await _hallMonitor.AddPlayerToRoomAsync(Convert.ToInt32(roomId), newPlayer);
            await Groups.AddToGroupAsync(this.Context.ConnectionId, roomId.ToString());

            await Clients.Group(roomId.ToString()).SendAsync("PlayerJoined", newPlayer);

            var roomInformation = await _hallMonitor.GetRoomInformationAsync(Convert.ToInt32(roomId));

            return roomInformation;
        }
    }
}
