from rest_framework import status, views, response, permissions
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import User, PatientProfile, HospitalProfile
from .serializers import UserSerializer, PatientProfileSerializer, HospitalProfileSerializer

from django.db import IntegrityError, transaction

class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    user = serializer.save()
                    role = request.data.get('role', User.Role.PATIENT)
                    
                    if role == User.Role.PATIENT:
                        PatientProfile.objects.create(
                            user=user,
                            phone_number=request.data.get('phone_number', ''),
                            address=request.data.get('address', ''),
                            nin=request.data.get('nin', ''),
                            nin_verified=True, 
                            dob=request.data.get('dob'),
                            gender=request.data.get('gender', ''),
                            health_pin=request.data.get('health_pin', ''),
                            biometric_enabled=request.data.get('biometric_enabled', False)
                        )
                    elif role == User.Role.HOSPITAL:
                        HospitalProfile.objects.create(
                            user=user,
                            hospital_name=request.data.get('hospital_name', ''),
                            address=request.data.get('address', '')
                        )
                    
                    token, created = Token.objects.get_or_create(user=user)
                    return response.Response({
                        'token': token.key,
                        'user': UserSerializer(user).data
                    }, status=status.HTTP_201_CREATED)
            except IntegrityError as e:
                print(f"DEBUG: Registration IntegrityError: {str(e)}")
                return response.Response({
                    'error': 'Account with this NIN or Username already exists.'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        print(f"DEBUG: Registration Serializer Errors: {serializer.errors}")
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        identifier = request.data.get('username')
        password = request.data.get('password')
        
        # Try direct authentication first (Username)
        user = authenticate(username=identifier, password=password)
        
        # If failed, try finding by NIN
        if not user:
            try:
                profile = PatientProfile.objects.get(nin=identifier)
                user = authenticate(username=profile.user.username, password=password)
            except PatientProfile.DoesNotExist:
                pass
                
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return response.Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        return response.Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class PasswordResetView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        nin = request.data.get('nin')
        new_password = request.data.get('password')
        
        if not nin or not new_password:
            return response.Response({'error': 'NIN and new password are required.'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            profile = PatientProfile.objects.get(nin=nin)
            user = profile.user
            user.set_password(new_password)
            user.save()
            return response.Response({'success': 'Password reset successful. You can now login.'})
        except PatientProfile.DoesNotExist:
            return response.Response({'error': 'NIN not found in our medical database.'}, status=status.HTTP_404_NOT_FOUND)

class ProfileView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == User.Role.PATIENT:
            profile = PatientProfile.objects.get(user=user)
            serializer = PatientProfileSerializer(profile)
        else:
            profile = HospitalProfile.objects.get(user=user)
            serializer = HospitalProfileSerializer(profile)
        return response.Response(serializer.data)

    def patch(self, request):
        user = request.user
        data = request.data.copy()
        
        # 1. Update User fields
        user_fields = ['first_name', 'last_name', 'email']
        user_updated = False
        for field in user_fields:
            if field in data:
                setattr(user, field, data.get(field))
                user_updated = True
                # Remove from data to avoid serializer errors in next step
                data.pop(field)
        
        if user_updated:
            user.save()

        # 2. Robust Date Parsing for DOB
        if 'dob' in data and data['dob']:
            from django.utils.dateparse import parse_date
            try:
                # Try parsing the date string using Django's built-in parser
                parsed_dob = parse_date(data['dob'])
                if parsed_dob:
                    data['dob'] = parsed_dob.strftime('%Y-%m-%d')
            except (ValueError, TypeError):
                print(f"DEBUG: Failed to parse DOB with Django parser: {data['dob']}")
                pass

        # 3. Update Profile fields
        if user.role == User.Role.PATIENT:
            profile = PatientProfile.objects.get(user=user)
            serializer = PatientProfileSerializer(profile, data=data, partial=True)
        else:
            profile = HospitalProfile.objects.get(user=user)
            serializer = HospitalProfileSerializer(profile, data=data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return response.Response(serializer.data)
        
        print(f"DEBUG: Profile Serializer Errors: {serializer.errors}")
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from .services.interswitch import InterswitchService

class VerifyNINView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        nin = request.data.get('nin')
        if not nin:
            return response.Response({'error': 'NIN is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        result = InterswitchService.verify_nin(nin)
        
        if result.get('status') == 'success':
            return response.Response(result['data'])
        else:
            # Change from 404 to 400 or something more descriptive
            error_message = result.get('message', 'Unknown Verification Error')
            print(f"NIN Verification Failed for {nin}: {error_message}") # Server-side log
            return response.Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)

class HealthRecordView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role == User.Role.PATIENT:
            records = HealthRecord.objects.filter(patient__user=request.user)
        else:
            # Hospital viewing records (assuming they have access to some records)
            records = HealthRecord.objects.all() # In a real app, restrict by patient access
        serializer = HealthRecordSerializer(records, many=True)
        return response.Response(serializer.data)

    def post(self, request):
        serializer = HealthRecordSerializer(data=request.data)
        if serializer.is_valid():
            patient_profile = None
            if request.user.role == User.Role.PATIENT:
                patient_profile = PatientProfile.objects.get(user=request.user)
            else:
                # Hospital uploading for a patient
                patient_id = request.data.get('patient_id')
                if patient_id:
                    patient_profile = PatientProfile.objects.get(id=patient_id)
            
            if patient_profile:
                serializer.save(patient=patient_profile, uploaded_by=request.user)
                return response.Response(serializer.data, status=status.HTTP_201_CREATED)
            return response.Response({'error': 'Patient Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HospitalPatientSearchView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != User.Role.HOSPITAL:
            return response.Response({'error': 'Only hospitals can search patients'}, status=status.HTTP_403_FORBIDDEN)
        
        query = request.query_params.get('q', '')
        patients = PatientProfile.objects.filter(user__first_name__icontains=query) | PatientProfile.objects.filter(user__last_name__icontains=query)
        serializer = PatientProfileSerializer(patients, many=True)
        return response.Response(serializer.data)

class HospitalPatientDetailView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, patient_id):
        if request.user.role != User.Role.HOSPITAL:
            return response.Response({'error': 'Only hospitals can view patient details'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            patient = PatientProfile.objects.get(id=patient_id)
            records = HealthRecord.objects.filter(patient=patient)
            patient_serializer = PatientProfileSerializer(patient)
            records_serializer = HealthRecordSerializer(records, many=True)
            return response.Response({
                'patient': patient_serializer.data,
                'records': records_serializer.data
            })
        except PatientProfile.DoesNotExist:
            return response.Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)

class DeliveryRequestView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.user.role != User.Role.PATIENT:
            return response.Response({'error': 'Only patients can request delivery'}, status=status.HTTP_403_FORBIDDEN)
        
        profile = PatientProfile.objects.get(user=request.user)
        serializer = DeliveryRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(patient=profile)
            return response.Response(serializer.data, status=status.HTTP_201_CREATED)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.db import models as db_models

class HospitalAnalyticsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != User.Role.HOSPITAL:
            return response.Response({'error': 'Only hospitals can view analytics'}, status=status.HTTP_403_FORBIDDEN)
        
        # Calculate analytics (Simple stats for now)
        total_patients = PatientProfile.objects.count()
        total_records = HealthRecord.objects.count()
        records_by_type = HealthRecord.objects.values('record_type').annotate(count=db_models.Count('id'))
        pending_appointments = Appointment.objects.filter(status=Appointment.Status.PENDING).count()

        return response.Response({
            'total_patients': total_patients,
            'total_records': total_records,
            'records_by_type': records_by_type,
            'pending_appointments': pending_appointments
        })

class AppointmentView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role == User.Role.PATIENT:
            appointments = Appointment.objects.filter(patient__user=request.user)
        else:
            appointments = Appointment.objects.filter(hospital__user=request.user)
        serializer = AppointmentSerializer(appointments, many=True)
        return response.Response(serializer.data)

    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            if request.user.role == User.Role.PATIENT:
                patient_profile = PatientProfile.objects.get(user=request.user)
                serializer.save(patient=patient_profile)
            else:
                hospital_profile = HospitalProfile.objects.get(user=request.user)
                serializer.save(hospital=hospital_profile)
            return response.Response(serializer.data, status=status.HTTP_201_CREATED)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

