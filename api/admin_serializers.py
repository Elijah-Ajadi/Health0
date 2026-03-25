from rest_framework import serializers
from .models import (
    User, HospitalProfile, PatientProfile, IdentityVerificationLog, 
    IdentityConflict, AuditLog, SecurityAlert, DataCorrectionRequest, 
    SystemConfig, HospitalApiKey, SupportTicket, HealthRecord
)

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_verified', 'is_staff_admin')

class AdminHospitalProfileSerializer(serializers.ModelSerializer):
    user = AdminUserSerializer(read_only=True)
    class Meta:
        model = HospitalProfile
        fields = (
            'id', 'user', 'hospital_name', 'category', 'address', 'contact_email', 
            'contact_phone', 'status', 'tier', 'cac_number', 'tin', 'hefamaa_id', 
            'director_name', 'mdcn_number', 'director_license_expiry', 
            'cac_document', 'hefamaa_license', 'letter_of_intent', 'proof_of_address', 
            'rejection_reason'
        )

class VerificationLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = IdentityVerificationLog
        fields = '__all__'

class IdentityConflictSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = IdentityConflict
        fields = '__all__'

class AuditLogSerializer(serializers.ModelSerializer):
    actor_name = serializers.CharField(source='actor.username', read_only=True)
    patient_name = serializers.SerializerMethodField()
    
    class Meta:
        model = AuditLog
        fields = '__all__'

    def get_patient_name(self, obj):
        if obj.patient:
            return f"{obj.patient.user.first_name} {obj.patient.user.last_name}"
        return None

class SecurityAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityAlert
        fields = '__all__'

class DataCorrectionRequestSerializer(serializers.ModelSerializer):
    requester_name = serializers.CharField(source='requester.username', read_only=True)
    class Meta:
        model = DataCorrectionRequest
        fields = '__all__'

class SystemConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemConfig
        fields = '__all__'

class HospitalApiKeySerializer(serializers.ModelSerializer):
    hospital_name = serializers.CharField(source='hospital.hospital_name', read_only=True)
    class Meta:
        model = HospitalApiKey
        fields = ('id', 'hospital', 'hospital_name', 'name', 'prefix', 'is_active', 'created_at')

class SupportTicketSerializer(serializers.ModelSerializer):
    creator_name = serializers.CharField(source='creator.username', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.username', read_only=True)
    
    class Meta:
        model = SupportTicket
        fields = '__all__'

class AdminPatientProfileSerializer(serializers.ModelSerializer):
    user = AdminUserSerializer(read_only=True)
    class Meta:
        model = PatientProfile
        fields = '__all__'
