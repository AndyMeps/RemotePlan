using System.Collections.Concurrent;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace RemotePlan.Server
{
    public class RoomCompare : IEqualityComparer<Room>
    {
        public bool Equals(Room? x, Room? y)
        {
            if (x == null && y == null)
                return true;
            if (x == null || y == null)
                return false;

            return x.RoomId == y.RoomId;
        }

        public int GetHashCode([DisallowNull] Room obj)
        {
            throw new NotImplementedException();
        }
    }

    public interface IHallMonitor
    {
        Task<bool> RoomExistsAsync(int roomId);
        Task CleanAsync();
        Task CreateRoomAsync(Room room);
        Task RemoveRoomAsync(int roomId);
        Task RemoveRoomAsync(Room room) => RemoveRoomAsync(room.RoomId);
        Task<Room?> GetRoomInformationAsync(int roomId);
        Task AddPlayerToRoomAsync(int roomId, Player player);
        Task<IEnumerable<int>> RemoveClientFromRoomsAsync(string clientId);
        Task<VoteResult> ClientVoteAsync(int roomId, string clientId, string choice);
        Task<Room> StartNewHandAsync(int roomId);
        Task<bool> AllVotesCastAsync(int roomId);
        Task<Player> SetPlayerInitialsAsync(int roomId, string playerId, string initials);
    }

    public record Player(string PlayerId, string? Initials);

    public class Room
    {
        public int RoomId { get; }
        public DateTime ExpiresAt { get; }
        public ConcurrentDictionary<string, Player> Players { get; } = new ConcurrentDictionary<string, Player>();
        public ConcurrentDictionary<string, string> Votes { get; } = new ConcurrentDictionary<string, string>();
        public Player? Owner { get; private set; }

        public Room(int roomId, DateTime expiresAt)
        {
            RoomId = roomId;
            ExpiresAt = expiresAt;
        }

        public void SetOwner(Player? player)
        {
            Owner = player;
        }
    }

    public record VoteResult(int RoomId, string PlayerId, string Vote);

    public class InMemoryHallMonitor : IHallMonitor
    {
        private readonly ILogger<InMemoryHallMonitor> _logger;

        public InMemoryHallMonitor(ILogger<InMemoryHallMonitor> logger)
        {
            _logger = logger;
        }

        public ConcurrentDictionary<int, Room> Rooms { get; private set; } = new ConcurrentDictionary<int, Room>();

        public Task RemoveRoomAsync(int roomId)
        {
            return Task.Run(() =>
            {
                Rooms.TryRemove(roomId, out _);
            });
        }

        public Task<bool> RoomExistsAsync(int roomId)
        {
            return Task.FromResult(Rooms.ContainsKey(roomId));
        }

        public Task CreateRoomAsync(Room room)
        {
            return Task.Run(() =>
            {
                if (Rooms.ContainsKey(room.RoomId))
                    throw new InvalidOperationException("Room Exists");

                Rooms.TryAdd(room.RoomId, room);
            });
        }

        public Task CleanAsync()
        {
            return Task.Run(() =>
            {
                _logger.LogInformation("There are currently {RoomCount} rooms active.", Rooms.Count());

                var markedForDeletion = new List<Room>();
                foreach (var room in Rooms.Values)
                {
                    if (room.ExpiresAt < DateTime.UtcNow)
                        markedForDeletion.Add(room);
                }

                foreach (var roomToDelete in markedForDeletion)
                {
                    _logger.LogInformation("Removing room [{RoomId}] that expired at {ExpirationDate}", roomToDelete.RoomId, roomToDelete.ExpiresAt);
                    Rooms.TryRemove(roomToDelete.RoomId, out _);
                }
            });
        }

        public Task<Room?> GetRoomInformationAsync(int roomId)
        {
            return Task.Run(() =>
            {
                if (!Rooms.ContainsKey(roomId))
                    return null;

                return Rooms[roomId];
            });
        }

        public Task AddPlayerToRoomAsync(int roomId, Player player)
        {
            return Task.Run(() =>
            {
                if (!Rooms.ContainsKey(roomId))
                    throw new InvalidOperationException("Room not found, cannot add user.");

                var room = Rooms[roomId];
                if (room.Players.ContainsKey(player.PlayerId))
                {
                    _logger.LogWarning("Attempt to add client to room they are already in. {ClientId}, {RoomId}", player.PlayerId, roomId);
                    return;
                }

                if (room.Players.IsEmpty)
                {
                    room.SetOwner(player);
                }

                room.Players.TryAdd(player.PlayerId, player);
            });
        }

        public Task<VoteResult> ClientVoteAsync(int roomId, string playerId, string vote)
        {
            return Task.Run(() =>
            {
                if (!Rooms.ContainsKey(roomId))
                    throw new InvalidOperationException("Room not found.");

                var room = Rooms[roomId];

                if (!room.Players.ContainsKey(playerId))
                    throw new InvalidOperationException("Player not in room.");

                var votes = room.Votes;
                if (votes.ContainsKey(playerId))
                {
                    votes[playerId] = vote;
                }
                else
                {
                    votes.TryAdd(playerId, vote);
                }

                return new VoteResult(roomId, playerId, vote);
            });
        }

        public Task<IEnumerable<int>> RemoveClientFromRoomsAsync(string playerId)
        {
            var removedFromRooms = new List<int>();

            foreach (var room in Rooms.Values)
            {
                if (room.Players.ContainsKey(playerId))
                {
                    room.Players.TryRemove(playerId, out _);
                    room.Votes.TryRemove(playerId, out _);
                    removedFromRooms.Add(room.RoomId);
                }
            }

            return Task.FromResult(removedFromRooms.AsEnumerable());
        }

        public Task<Room> StartNewHandAsync(int roomId)
        {
            return Task.Run(() =>
            {
                if (!Rooms.ContainsKey(roomId))
                    throw new InvalidOperationException("Room not found.");

                Rooms[roomId].Votes.Clear();

                return Rooms[roomId];
            });
        }

        public Task<bool> AllVotesCastAsync(int roomId)
        {
            var room = Rooms[roomId];

            return Task.FromResult(room.Players.Count == room.Votes.Count && room.Votes.All(p => p.Value != null));
        }

        public Task<Player> SetPlayerInitialsAsync(int roomId, string playerId, string initials)
        {
            var room = Rooms[roomId];

            if (!room.Players.ContainsKey(playerId))
                throw new InvalidOperationException("Player not found in room.");

            var newPlayer = new Player(playerId, initials);
            room.Players.TryUpdate(playerId, newPlayer, room.Players[playerId]);

            return Task.FromResult(newPlayer);
        }
    }
}
