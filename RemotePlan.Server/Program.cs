using RemotePlan.Server;
using RemotePlan.Server.Endpoints;
using RemotePlan.Server.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHostedService<RoomCleanupService>();
builder.Services.AddRazorPages();
builder.Services.AddSignalR();
builder.Services.AddSingleton<IHallMonitor, InMemoryHallMonitor>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAuthorization();

app.MapRazorPages();
app.MapHub<PlanHub>("/PlanHub");
app.MapFallbackToFile("/index.html");
app.MapRoomEndpoints();

app.Run();
