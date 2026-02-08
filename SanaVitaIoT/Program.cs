using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SanaVitaIoT.Data;
using SanaVitaIoT.Services;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text.Json;

namespace SanaVitaIoT
{
    public class Program
    {
        public static int PatientId { get; private set; }
        public static int MedicalDeviceId { get; private set; }
        public static Dictionary<string, string> LocalizationResources { get; private set; }

        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddDbContext<SmartWatchDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("SmartWatchDbConnection")));
            builder.Services.AddHostedService<MeasurementService>();

            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "SmartWatch API", Version = "v1" });
            });

            var app = builder.Build();

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "SmartWatch API v1");
            });

            app.UseRouting();

            app.UseAuthorization();

            app.MapControllers();

            var locale = GetUserLocale();
            LocalizationResources = LoadLocalizationResource(locale);

            Console.WriteLine(LocalizationResources["EnterPatientId"]);
            PatientId = int.Parse(Console.ReadLine());

            Console.WriteLine(LocalizationResources["EnterMedicalDeviceId"]);
            MedicalDeviceId = int.Parse(Console.ReadLine());

            app.Run();
        }

        static Locale GetUserLocale()
        {
            while (true)
            {
                Console.Write("Select your language (en/ua): ");
                string selectedLocale = Console.ReadLine().ToLower();

                if (selectedLocale == "en" || selectedLocale == "ua")
                {
                    return selectedLocale == "en" ? Locale.en : Locale.ua;
                }

                Console.WriteLine("Invalid choice. Please enter 'en' for English or 'ua' for Ukrainian.");
            }
        }

        static Dictionary<string, string> LoadLocalizationResource(Locale locale)
        {
            string localizationFileName = $"Locales\\{locale}.json";
            Dictionary<string, string> resource = new Dictionary<string, string>();

            try
            {
                string json = File.ReadAllText(localizationFileName);
                resource = JsonSerializer.Deserialize<Dictionary<string, string>>(json);
            }
            catch (FileNotFoundException)
            {
                Console.WriteLine($"Localization file '{localizationFileName}' not found. Using default locale.");
                string defaultLocalizationFileName = "Locales\\ua.json";
                string json = File.ReadAllText(defaultLocalizationFileName);
                resource = JsonSerializer.Deserialize<Dictionary<string, string>>(json);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading localization: {ex.Message}");
            }

            return resource;
        }
    }

    public enum Locale
    {
        en,
        ua
    }
}
