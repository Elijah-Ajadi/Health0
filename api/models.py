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
    is_staff_admin = models.BooleanField(default=False) # For sub-admins

    def __str__(self):
        return self.username

class HospitalProfile(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', _('Pending Verification')
        ACTIVE = 'ACTIVE', _('Active')
        SUSPENDED = 'SUSPENDED', _('Suspended')
        DEACTIVATED = 'DEACTIVATED', _('Deactivated')

    class Tier(models.TextChoices):
        PRIMARY = 'PRIMARY', _('Primary')
        SECONDARY = 'SECONDARY', _('Secondary')
        TERTIARY = 'TERTIARY', _('Tertiary')

    class Category(models.TextChoices):
        PRIVATE = 'PRIVATE', _('Private Hospital')
        PUBLIC = 'PUBLIC', _('Public General Hospital')
        PHARMACY = 'PHARMACY', _('Pharmacy')
        DIAGNOSTIC = 'DIAGNOSTIC', _('Diagnostic Lab')
        PRIMARY = 'PRIMARY', _('Primary Health Centre')

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='hospital_profile')
    hospital_name = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=Category.choices, default=Category.PRIVATE)
    address = models.TextField()
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    
    # New Admin & Onboarding Fields
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    tier = models.CharField(max_length=20, choices=Tier.choices, default=Tier.PRIMARY)
    
    # Step A: Basic Identity
    cac_number = models.CharField(max_length=50, unique=True)
    tin = models.CharField(max_length=50, blank=True, null=True)
    
    # Step B: Clinical Accreditation
    hefamaa_id = models.CharField(max_length=50, unique=True, blank=True, null=True)
    director_name = models.CharField(max_length=255, blank=True)
    mdcn_number = models.CharField(max_length=50, blank=True)
    director_license_expiry = models.DateField(null=True, blank=True)
    
    # Step C: Document Uploads
    cac_document = models.FileField(upload_to='hospitals/cac/', null=True, blank=True)
    hefamaa_license = models.FileField(upload_to='hospitals/hefamaa/', null=True, blank=True)
    letter_of_intent = models.FileField(upload_to='hospitals/loi/', null=True, blank=True)
    proof_of_address = models.FileField(upload_to='hospitals/address_proof/', null=True, blank=True)
    
    rejection_reason = models.TextField(blank=True) 
    
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

class IdentityVerificationLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    nin_queried = models.CharField(max_length=30)
    status = models.CharField(max_length=20) # SUCCESS, FAILURE
    error_message = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    def __str__(self):
        return f"{self.nin_queried} - {self.status} at {self.timestamp}"

class IdentityConflict(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', _('Pending Review')
        RESOLVED = 'RESOLVED', _('Resolved')

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    nin_data = models.JSONField() # Data from Interswitch
    signup_data = models.JSONField() # Data provided during signup
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    resolution_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class AuditLog(models.Model):
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='audit_actions')
    action = models.CharField(max_length=100) # VIEW_RECORD, UPLOAD_RECORD, etc.
    patient = models.ForeignKey(PatientProfile, on_delete=models.SET_NULL, null=True)
    resource_type = models.CharField(max_length=50) # HealthRecord, PatientProfile
    resource_id = models.IntegerField(null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    details = models.TextField(blank=True)

class SecurityAlert(models.Model):
    class Severity(models.TextChoices):
        INFO = 'INFO', _('Info')
        WARNING = 'WARNING', _('Warning')
        CRITICAL = 'CRITICAL', _('Critical')

    severity = models.CharField(max_length=20, choices=Severity.choices, default=Severity.INFO)
    message = models.TextField()
    is_resolved = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

class DataCorrectionRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        APPROVED = 'APPROVED', _('Approved')
        REJECTED = 'REJECTED', _('Rejected')

    requester = models.ForeignKey(User, on_delete=models.CASCADE)
    record = models.ForeignKey('HealthRecord', on_delete=models.CASCADE, null=True, blank=True)
    description = models.TextField()
    proposed_data = models.JSONField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

class SystemConfig(models.Model):
    maintenance_mode = models.BooleanField(default=False)
    global_message = models.TextField(blank=True)
    ussd_active = models.BooleanField(default=True)
    interswitch_credits = models.IntegerField(default=1000)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "System Configuration"

class HospitalApiKey(models.Model):
    hospital = models.ForeignKey(HospitalProfile, on_delete=models.CASCADE, related_name='api_keys')
    name = models.CharField(max_length=100, default='Default Key')
    prefix = models.CharField(max_length=16, unique=True)
    hashed_key = models.CharField(max_length=128)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class SupportTicket(models.Model):
    class Status(models.TextChoices):
        OPEN = 'OPEN', _('Open')
        IN_PROGRESS = 'IN_PROGRESS', _('In Progress')
        CLOSED = 'CLOSED', _('Closed')

    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets')
    subject = models.CharField(max_length=255)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets')
    created_at = models.DateTimeField(auto_now_add=True)

class HealthRecord(models.Model):
    class RecordType(models.TextChoices):
        DOCUMENT = 'DOCUMENT', _('Document')
        IMAGE = 'IMAGE', _('Image')
        PDF = 'PDF', _('PDF')
        EVENT = 'EVENT', _('Manual Health Event')

    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='records')
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='uploaded_records')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='health_records/', null=True, blank=True)
    record_type = models.CharField(max_length=10, choices=RecordType.choices)
    is_verified = models.BooleanField(default=True)
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

class EmergencyToken(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='emergency_tokens')
    token = models.CharField(max_length=6)
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        from django.utils import timezone
        return not self.is_used and self.expires_at > timezone.now()

    def __str__(self):
        return f"Token for {self.patient} - {self.token}"
