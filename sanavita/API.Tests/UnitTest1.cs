using sanavita.Controllers;
using sanavita.Interfaces;
using sanavita.Models;
using sanavita.Dto;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using AutoMapper;
using System.Collections.Generic;

namespace API.Tests
{
    public class PatientControllerTests
    {
        private Mock<IPatientRepository> _patientRepositoryMock;
        private Mock<IBloodTypeRepository> _bloodTypeRepositoryMock;
        private Mock<ICompanyRepository> _companyRepositoryMock;
        private Mock<UserManager<ApplicationUser>> _userManagerMock;
        private Mock<IMapper> _mapperMock;
        private PatientController _controller;

        [SetUp]
        public void Setup()
        {
            _patientRepositoryMock = new Mock<IPatientRepository>();
            _bloodTypeRepositoryMock = new Mock<IBloodTypeRepository>();
            _companyRepositoryMock = new Mock<ICompanyRepository>();
            _userManagerMock = new Mock<UserManager<ApplicationUser>>(Mock.Of<IUserStore<ApplicationUser>>(), null, null, null, null, null, null, null, null);
            _mapperMock = new Mock<IMapper>();

            _controller = new PatientController(
                _userManagerMock.Object,
                _bloodTypeRepositoryMock.Object,
                _companyRepositoryMock.Object,
                _patientRepositoryMock.Object,
                _mapperMock.Object);
        }

        [TearDown]
        public void TearDown()
        {
            _controller?.Dispose();
        }

        [Test]
        public void GetPatients_ReturnsOkResult_WithListOfPatients()
        {
            var patients = new List<Patient> { new Patient() };
            _patientRepositoryMock.Setup(repo => repo.GetPatients()).Returns(patients);

            var result = _controller.GetPatients();

            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.NotNull(okResult);
            Assert.IsInstanceOf<List<Patient>>(okResult.Value);
            Assert.AreEqual(1, ((List<Patient>)okResult.Value).Count);
        }

        [Test]
        public void GetPatient_ExistingId_ReturnsOkResult_WithPatient()
        {
            var patient = new Patient { PatientId = 1, Gender = "Ì" };
            _patientRepositoryMock.Setup(repo => repo.PatientExists(1)).Returns(true);
            _patientRepositoryMock.Setup(repo => repo.GetPatient(1)).Returns(patient);

            var result = _controller.GetPatient(1);

            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.NotNull(okResult);
            Assert.IsInstanceOf<Patient>(okResult.Value);
            Assert.AreEqual("Ì", ((Patient)okResult.Value).Gender);
        }

        [Test]
        public void GetPatient_NonExistingId_ReturnsNotFoundResult()
        {
            _patientRepositoryMock.Setup(repo => repo.PatientExists(1)).Returns(false);

            var result = _controller.GetPatient(1);

            Assert.IsInstanceOf<NotFoundResult>(result);
        }
    }

    public class DoctorControllerTests
    {
        private Mock<ISpecializationRepository> _specializationRepositoryMock;
        private Mock<UserManager<ApplicationUser>> _userManagerMock;
        private Mock<IDoctorRepository> _doctorRepositoryMock;
        private Mock<IMapper> _mapperMock;
        private DoctorController _controller;

        [SetUp]
        public void Setup()
        {
            _specializationRepositoryMock = new Mock<ISpecializationRepository>();
            _userManagerMock = new Mock<UserManager<ApplicationUser>>(Mock.Of<IUserStore<ApplicationUser>>(), null, null, null, null, null, null, null, null);
            _doctorRepositoryMock = new Mock<IDoctorRepository>();
            _mapperMock = new Mock<IMapper>();

            _controller = new DoctorController(
                _specializationRepositoryMock.Object,
                _userManagerMock.Object,
                _doctorRepositoryMock.Object,
                _mapperMock.Object);
        }

        [TearDown]
        public void TearDown()
        {
            _controller?.Dispose();
        }

        [Test]
        public void GetDoctors_ReturnsOkResult_WithListOfDoctors()
        {
            var doctors = new List<Doctor> { new Doctor() };
            _doctorRepositoryMock.Setup(repo => repo.GetDoctors()).Returns(doctors);

            var result = _controller.GetDoctors();

            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.NotNull(okResult);
            Assert.IsInstanceOf<List<Doctor>>(okResult.Value);
            Assert.AreEqual(1, ((List<Doctor>)okResult.Value).Count);
        }

        [Test]
        public void GetDoctor_ExistingId_ReturnsOkResult_WithDoctor()
        {
            var doctor = new Doctor { DoctorId = 1 };
            _doctorRepositoryMock.Setup(repo => repo.DoctorExists(1)).Returns(true);
            _doctorRepositoryMock.Setup(repo => repo.GetDoctor(1)).Returns(doctor);

            var result = _controller.GetDoctor(1);

            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.NotNull(okResult);
            Assert.IsInstanceOf<Doctor>(okResult.Value);
            Assert.AreEqual(1, ((Doctor)okResult.Value).DoctorId);
        }

        [Test]
        public void GetDoctor_NonExistingId_ReturnsNotFoundResult()
        {
            _doctorRepositoryMock.Setup(repo => repo.DoctorExists(1)).Returns(false);

            var result = _controller.GetDoctor(1);

            Assert.IsInstanceOf<NotFoundResult>(result);
        }
    }

    public class NotificationControllerTests
    {
        private Mock<INotificationRepository> _notificationRepositoryMock;
        private Mock<IPatientRepository> _patientRepositoryMock;
        private Mock<IDoctorRepository> _doctorRepositoryMock;
        private Mock<IMapper> _mapperMock;
        private NotificationController _controller;

        [SetUp]
        public void Setup()
        {
            _notificationRepositoryMock = new Mock<INotificationRepository>();
            _patientRepositoryMock = new Mock<IPatientRepository>();
            _doctorRepositoryMock = new Mock<IDoctorRepository>();
            _mapperMock = new Mock<IMapper>();

            _controller = new NotificationController(
                _notificationRepositoryMock.Object,
                _patientRepositoryMock.Object,
                _doctorRepositoryMock.Object,
                _mapperMock.Object);
        }

        [TearDown]
        public void TearDown()
        {
            _controller?.Dispose();
        }

        [Test]
        public void GetNotifications_ReturnsOkResult_WithListOfNotifications()
        {
            var notifications = new List<Notification> { new Notification() };
            var notificationDtos = new List<NotificationDto> { new NotificationDto() };
            _notificationRepositoryMock.Setup(repo => repo.GetNotifications()).Returns(notifications);
            _mapperMock.Setup(m => m.Map<List<NotificationDto>>(notifications)).Returns(notificationDtos);

            var result = _controller.GetNotifications();

            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.NotNull(okResult);
            Assert.IsInstanceOf<List<NotificationDto>>(okResult.Value);
            Assert.AreEqual(1, ((List<NotificationDto>)okResult.Value).Count);
        }

        [Test]
        public void GetNotification_ExistingId_ReturnsOkResult_WithNotification()
        {
            var notification = new Notification { NotificationId = 1 };
            var notificationDto = new NotificationDto { NotificationId = 1 };
            _notificationRepositoryMock.Setup(repo => repo.NotificationExists(1)).Returns(true);
            _notificationRepositoryMock.Setup(repo => repo.GetNotification(1)).Returns(notification);
            _mapperMock.Setup(m => m.Map<NotificationDto>(notification)).Returns(notificationDto);

            var result = _controller.GetNotification(1);

            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.NotNull(okResult);
            Assert.IsInstanceOf<NotificationDto>(okResult.Value);
            Assert.AreEqual(1, ((NotificationDto)okResult.Value).NotificationId);
        }

        [Test]
        public void GetNotification_NonExistingId_ReturnsNotFoundResult()
        {
            _notificationRepositoryMock.Setup(repo => repo.NotificationExists(1)).Returns(false);

            var result = _controller.GetNotification(1);

            Assert.IsInstanceOf<NotFoundResult>(result);
        }
    }
}