using Microsoft.AspNetCore.Mvc;
using RemotePlan.Server;
using RemotePlan.Server.Endpoints;
using RemotePlan.Server.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHostedService<RoomCleanupService>();

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddSignalR();

builder.Services.AddSingleton<IHallMonitor, InMemoryHallMonitor>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<PlanHub>("/PlanHub");
});

app.MapRoomEndpoints();

app.MapRazorPages();

app.Run();
