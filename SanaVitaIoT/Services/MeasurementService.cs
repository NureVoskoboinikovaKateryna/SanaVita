using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SanaVitaIoT.Data;
using SanaVitaIoT.Models;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SanaVitaIoT.Services
{
    public class MeasurementService : IHostedService, IDisposable
    {
        private Timer _timer;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly Random _random = new Random();
        private const double MinTemp = 36;
        private const double MaxTemp = 37.2;
        private const int MinPulse = 60;
        private const int MaxPulse = 100;
        private const double MinWeight = 65.0;
        private const double MaxWeight = 70.0;

        private bool _forceOutOfRange = false;

        public MeasurementService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromSeconds(15));
            return Task.CompletedTask;
        }

        private void DoWork(object state)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<SmartWatchDbContext>();

            /*double temperature;
            if (_forceOutOfRange)
            {
                temperature = _random.NextDouble() > 0.5 ? MinTemp - 1 : MaxTemp + 1;
                _forceOutOfRange = false;
            }
            else
            {
                temperature = _random.NextDouble() * (MaxTemp - MinTemp) + MinTemp;
            }*/

            var temperature = _random.NextDouble() * (MaxTemp - MinTemp) + MinTemp;

            var measurement = new Measurement
            {
                PatientId = Program.PatientId,
                MeasurementValue = (float)temperature,
                MedicalDeviceId = Program.MedicalDeviceId,
                MeasurementDate = DateTime.UtcNow
            };

            context.Measurements.Add(measurement);
            context.SaveChanges();

            if (temperature < MinTemp || temperature > MaxTemp)
            {
                Console.WriteLine($"{Program.LocalizationResources["TemperatureOutOfRange"]} {temperature}");
            }


            // Пульс
            /*var pulse = _random.NextDouble() * (MaxPulse - MinPulse) + MinPulse;

            var pulseMeasurement = new Measurement
            {
                PatientId = Program.PatientId,
                MeasurementValue = (float)pulse,
                MedicalDeviceId = Program.MedicalDeviceId,
                MeasurementDate = DateTime.UtcNow
            };
            context.Measurements.Add(pulseMeasurement);
            context.SaveChanges();*/


            // Вага
            /*var weight = _random.NextDouble() * (MaxWeight - MinWeight) + MinWeight;

            var weightMeasurement = new Measurement
            {
                PatientId = Program.PatientId,
                MeasurementValue = (float)weight,
                MedicalDeviceId = Program.MedicalDeviceId,
                MeasurementDate = DateTime.UtcNow
            };
            context.Measurements.Add(weightMeasurement);
            context.SaveChanges();*/

        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
