from rest_framework import status, views, response, permissions, generics, filters
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import (
    User, HospitalProfile, PatientProfile, IdentityVerificationLog, 
    IdentityConflict, AuditLog, SecurityAlert, DataCorrectionRequest, 
    SystemConfig, HospitalApiKey, SupportTicket, HealthRecord
)
from .admin_serializers import (
    AdminHospitalProfileSerializer, VerificationLogSerializer, 
    IdentityConflictSerializer, AuditLogSerializer, SecurityAlertSerializer, 
    DataCorrectionRequestSerializer, SystemConfigSerializer, 
    HospitalApiKeySerializer, SupportTicketSerializer, AdminUserSerializer
)
import secrets
import hashlib

class IsAdminOrStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.role == User.Role.ADMIN or request.user.is_staff_admin or request.user.is_superuser)

# --- Module 1: Hospital Management & Vetting ---

class PendingHospitalListView(generics.ListAPIView):
    permission_classes = [IsAdminOrStaff]
    serializer_class = AdminHospitalProfileSerializer
    queryset = HospitalProfile.objects.filter(status=HospitalProfile.Status.PENDING)

class HospitalVerifyView(views.APIView):
    permission_classes = [IsAdminOrStaff]

    def post(self, request, hospital_id):
        action = request.data.get('action') # APPROVE or REJECT
        hospital = get_object_or_404(HospitalProfile, id=hospital_id)
        
        if action == 'APPROVE':
            hospital.status = HospitalProfile.Status.ACTIVE
            hospital.save()
            
            # Generate initial API Key
            prefix = secrets.token_hex(8)
            raw_key = secrets.token_urlsafe(32)
            hashed_key = hashlib.sha256(raw_key.encode()).hexdigest()
            HospitalApiKey.objects.create(
                hospital=hospital,
                prefix=prefix,
                hashed_key=hashed_key,
                name="Default Production Key"
            )
            
            # In a real app: Trigger email with key
            return response.Response({
                'status': 'Hospital approved',
                'api_key': f"h0_{prefix}_{raw_key}"
            })
            
        elif action == 'REJECT':
            reason = request.data.get('reason', 'Documents did not meet requirements.')
            hospital.status = HospitalProfile.Status.DEACTIVATED
            hospital.rejection_reason = reason
            hospital.save()
            # In a real app: Trigger rejection email
            return response.Response({'status': 'Hospital rejected'})
            
        return response.Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)

class HospitalRegistryView(generics.ListAPIView):
    permission_classes = [IsAdminOrStaff]
    serializer_class = AdminHospitalProfileSerializer
    queryset = HospitalProfile.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['hospital_name', 'address', 'contact_email']

class HospitalStatusToggleView(views.APIView):
    permission_classes = [IsAdminOrStaff]

    def post(self, request, hospital_id):
        hospital = get_object_or_404(HospitalProfile, id=hospital_id)
        new_status = request.data.get('status')
        if new_status in HospitalProfile.Status.values:
            hospital.status = new_status
            hospital.save()
            return response.Response({'status': f'Hospital status updated to {new_status}'})
        return response.Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

# --- Module 2: Identity & Verification Oversight ---

class VerificationLogListView(generics.ListAPIView):
    permission_classes = [IsAdminOrStaff]
    serializer_class = VerificationLogSerializer
    queryset = IdentityVerificationLog.objects.all().order_by('-timestamp')

class IdentityConflictListView(generics.ListCreateAPIView):
    permission_classes = [IsAdminOrStaff]
    serializer_class = IdentityConflictSerializer
    queryset = IdentityConflict.objects.all().order_by('-created_at')

class KYCAnalyticsView(views.APIView):
    permission_classes = [IsAdminOrStaff]

    def get(self, request):
        config = SystemConfig.objects.first()
        if not config:
            config = SystemConfig.objects.create()
        
        total_checks = IdentityVerificationLog.objects.count()
        success_rate = (IdentityVerificationLog.objects.filter(status='SUCCESS').count() / total_checks * 100) if total_checks > 0 else 0
        
        return response.Response({
            'api_credits_remaining': config.interswitch_credits,
            'total_verifications': total_checks,
            'success_rate': round(success_rate, 2)
        })

# --- Module 3: Security, Audit & Compliance ---

class GlobalAuditTrailView(generics.ListAPIView):
    permission_classes = [IsAdminOrStaff]
    serializer_class = AuditLogSerializer
    queryset = AuditLog.objects.all().order_by('-timestamp')
    filter_backends = [filters.SearchFilter]
    search_fields = ['actor__username', 'patient__user__first_name', 'action']

class SecurityAlertListView(generics.ListAPIView):
    permission_classes = [IsAdminOrStaff]
    serializer_class = SecurityAlertSerializer
    queryset = SecurityAlert.objects.filter(is_resolved=False).order_by('-timestamp')

class DataCorrectionRequestView(generics.ListCreateAPIView):
    permission_classes = [IsAdminOrStaff]
    serializer_class = DataCorrectionRequestSerializer
    queryset = DataCorrectionRequest.objects.all().order_by('-created_at')

# --- Module 4: System Configuration ---

class SystemConfigView(views.APIView):
    permission_classes = [IsAdminOrStaff]

    def get(self, request):
        config = SystemConfig.objects.first()
        if not config:
            config = SystemConfig.objects.create()
        serializer = SystemConfigSerializer(config)
        return response.Response(serializer.data)

    def patch(self, request):
        config = SystemConfig.objects.first()
        serializer = SystemConfigSerializer(config, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return response.Response(serializer.data)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class APIKeyManagementView(generics.ListCreateAPIView):
    permission_classes = [IsAdminOrStaff]
    serializer_class = HospitalApiKeySerializer
    
    def get_queryset(self):
        hospital_id = self.request.query_params.get('hospital_id')
        if hospital_id:
            return HospitalApiKey.objects.filter(hospital_id=hospital_id)
        return HospitalApiKey.objects.all()

class USSDStatusView(views.APIView):
    permission_classes = [IsAdminOrStaff]

    def get(self, request):
        # In a real app, query Africa's Talking API
        return response.Response({
            'gateway': 'Africa\'s Talking',
            'status': 'ONLINE',
            'sessions_active': 12,
            'last_ping': timezone.now()
        })

# --- Module 5: User Support & Helpdesk ---

class SupportTicketListView(generics.ListCreateAPIView):
    permission_classes = [IsAdminOrStaff]
    serializer_class = SupportTicketSerializer
    queryset = SupportTicket.objects.all().order_by('-created_at')

class SubAdminManagementView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAdminUser] # Only SuperAdmin
    serializer_class = AdminUserSerializer
    
    def get_queryset(self):
        return User.objects.filter(is_staff_admin=True)

    def post(self, request):
        username = request.data.get('username')
        user = get_object_or_404(User, username=username)
        user.is_staff_admin = True
        user.save()
        return response.Response({'status': f'{username} is now a Staff Admin'})
