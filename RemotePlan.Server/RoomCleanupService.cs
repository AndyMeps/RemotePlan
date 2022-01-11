namespace RemotePlan.Server
{
    public class RoomCleanupService : BackgroundService
    {
        private readonly ILogger<RoomCleanupService> _log;
        private readonly IHallMonitor _hallMonitor;
        private readonly TimeSpan _cleanupInterval;

        public RoomCleanupService(ILogger<RoomCleanupService> log, IHallMonitor hallMonitor)
        {
            _log = log;
            _hallMonitor = hallMonitor;
            _cleanupInterval = TimeSpan.FromMinutes(15);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _log.LogDebug("[RoomCleanupService] is running.");

            while (!stoppingToken.IsCancellationRequested)
            {
                _log.LogDebug("[RoomCleanupService] Waiting {CleanupInterval} before running cleanup.", _cleanupInterval);
                await Task.Delay(_cleanupInterval, stoppingToken);

                await _hallMonitor.CleanAsync();
            }
        }
    }
}
