using Microsoft.AspNetCore.Mvc;

namespace RemotePlan.Server.Endpoints
{
    public static class RoomEndpoints
    {
        private const string BASE_PATH = "/api/room";
        public static void MapRoomEndpoints(this WebApplication? app)
        {
            if (app is null)
                throw new ArgumentNullException(nameof(app));

            app.MapPost(BASE_PATH, async (IHallMonitor hallMonitor) =>
            {
                int roomId;
                do
                {
                    roomId = Random.Shared.Next(0, 1000000);
                } while (await hallMonitor.RoomExistsAsync(roomId));

                var room = new Room(roomId, DateTime.UtcNow.Add(TimeSpan.FromHours(3)));

                await hallMonitor.CreateRoomAsync(room);

                return Results.Ok(room);
            });

            app.MapGet($"{BASE_PATH}/{{roomId}}", async (int roomId, IHallMonitor hallMonitor) =>
            {
                if (await hallMonitor.RoomExistsAsync(roomId))
                    return Results.Ok(await hallMonitor.GetRoomInformationAsync(roomId));

                return Results.NotFound(new ProblemDetails { Title = "Room Not Found", Detail = "Could not find the requested room." });
            });
        }
    }
}
