from rest_framework import serializers
from .models import User, PatientProfile, HospitalProfile, HealthRecord, Appointment, DeliveryRequest

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    patient_profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role', 'first_name', 'last_name', 'patient_profile', 'is_superuser', 'is_staff_admin')

    def get_patient_profile(self, obj):
        try:
            profile = obj.patient_profile
            return {
                'nin': profile.nin,
                'phone_number': profile.phone_number,
                'address': profile.address,
                'dob': profile.dob,
                'gender': profile.gender
            }
        except:
            return None

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class PatientProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = PatientProfile
        fields = '__all__'

class HospitalProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = HospitalProfile
        fields = '__all__'

class HealthRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthRecord
        fields = '__all__'
        read_only_fields = ('uploaded_by', 'is_verified')

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'

class DeliveryRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryRequest
        fields = '__all__'
