using AutoMapper;
using sanavita.Dto;
using sanavita.Models;
using sanavita.POST;

namespace sanavita.Helper
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Administrator, AdministratorDto>();
            CreateMap<AdministratorDto, Administrator>();

            CreateMap<Patient, PatientDto>();
            CreateMap<PatientPOST, Patient>();
            CreateMap<PatientUPDATE, Patient>();

            CreateMap<Company, CompanyDto>();
            CreateMap<CompanyDto, Company>();

            CreateMap<CompanyManager, CompanyManagerDto>();
            CreateMap<CompanyManagerDto, CompanyManager>();
            CreateMap<CompanyManagerPOST, CompanyManager>();

            CreateMap<Doctor, DoctorDto>();
            CreateMap<DoctorDto, Doctor>();
            CreateMap<DoctorPOST, Doctor>();

            CreateMap<Measurement, MeasurementDto>();
            CreateMap<MeasurementDto, Measurement>();

            CreateMap<MedicalDevice, MedicalDeviceDto>();
            CreateMap<MedicalDeviceDto, MedicalDevice>();

            CreateMap<MedicalRecord, MedicalRecordDto>();
            CreateMap<MedicalRecordDto, MedicalRecord>();

            CreateMap<Notification, NotificationDto>();
            CreateMap<NotificationDto, Notification>();

            CreateMap<Manufacturer, ManufacturerDto>();
            CreateMap<ManufacturerDto, Manufacturer>();

            CreateMap<MedicalDeviceType, MedicalDeviceTypeDto>();
            CreateMap<MedicalDeviceTypeDto, MedicalDeviceType>();
        }
    }
}
