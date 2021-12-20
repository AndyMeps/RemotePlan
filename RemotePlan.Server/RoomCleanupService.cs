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
            _cleanupInterval = TimeSpan.FromSeconds(5);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _log.LogDebug("[RoomCleanupService] is running.");

            while (!stoppingToken.IsCancellationRequested)
            {
                _log.LogDebug("[RoomCleanupService] Waiting {CleanupInterval} before running cleanup.", _cleanupInterval);
                Thread.Sleep(_cleanupInterval);

                await _hallMonitor.CleanAsync();
            }
        }
    }
}
