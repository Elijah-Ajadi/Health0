from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', _('Admin')
        PATIENT = 'PATIENT', _('Patient')
        HOSPITAL = 'HOSPITAL', _('Hospital')

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.PATIENT)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.username

class HospitalProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='hospital_profile')
    hospital_name = models.CharField(max_length=255)
    address = models.TextField()
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    
    def __str__(self):
        return self.hospital_name

class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    phone_number = models.CharField(max_length=20)
    address = models.TextField()
    nin = models.CharField(max_length=30, unique=True, null=True, blank=True)
    nin_verified = models.BooleanField(default=False)
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, blank=True)
    health_pin = models.CharField(max_length=128, blank=True) # Hashed PIN
    biometric_enabled = models.BooleanField(default=False)
    
    # Health data
    blood_group = models.CharField(max_length=5, blank=True)
    genotype = models.CharField(max_length=5, blank=True)
    allergies = models.TextField(blank=True)
    confirmed_health_conditions = models.TextField(blank=True)
    hospital_of_treatment = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

class HealthRecord(models.Model):
    class RecordType(models.TextChoices):
        DOCUMENT = 'DOCUMENT', _('Document')
        IMAGE = 'IMAGE', _('Image')
        PDF = 'PDF', _('PDF')

    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='records')
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='uploaded_records')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='health_records/')
    record_type = models.CharField(max_length=10, choices=RecordType.choices)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Appointment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        CONFIRMED = 'CONFIRMED', _('Confirmed')
        CANCELLED = 'CANCELLED', _('Cancelled')
        COMPLETED = 'COMPLETED', _('Completed')

    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='appointments')
    hospital = models.ForeignKey(HospitalProfile, on_delete=models.CASCADE, related_name='appointments')
    date = models.DateField()
    time = models.TimeField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient} at {self.hospital} on {self.date}"

class DeliveryRequest(models.Model):
    class DeliveryType(models.TextChoices):
        EMAIL = 'EMAIL', _('Email')
        PHYSICAL = 'PHYSICAL', _('Physical Location')

    class Status(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        PROCESSING = 'PROCESSING', _('Processing')
        DELIVERED = 'DELIVERED', _('Delivered')
        FAILED = 'FAILED', _('Failed')

    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='delivery_requests')
    delivery_type = models.CharField(max_length=20, choices=DeliveryType.choices)
    address_or_email = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.delivery_type} request for {self.patient}"
