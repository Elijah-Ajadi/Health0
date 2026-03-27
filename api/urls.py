from django.urls import path
from .views import RegisterView, LoginView, ProfileView, VerifyNINView, HealthRecordView, HospitalPatientSearchView, HospitalPatientDetailView, DeliveryRequestView, HospitalAnalyticsView, AppointmentView, PasswordResetView, PatientAuditLogView
from . import admin_views, hospital_views

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('hospital/signup/', hospital_views.HospitalSignupView.as_view(), name='hospital-signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('verify-nin/', VerifyNINView.as_view(), name='verify-nin'),
    path('records/', HealthRecordView.as_view(), name='records'),
    path('hospital/search/', HospitalPatientSearchView.as_view(), name='hospital-search'),
    path('hospital/patient/<int:patient_id>/', HospitalPatientDetailView.as_view(), name='hospital-patient-detail'),
    path('hospital/analytics/', HospitalAnalyticsView.as_view(), name='hospital-analytics'),
    path('appointments/', AppointmentView.as_view(), name='appointments'),
    path('delivery-request/', DeliveryRequestView.as_view(), name='delivery-request'),
    path('audit-log/', PatientAuditLogView.as_view(), name='audit-log'),
    path('reset-password', PasswordResetView.as_view(), name='password-reset'),

    # Admin Endpoints (Module 1: Hospital Management)
    path('admin/hospitals/pending/', admin_views.PendingHospitalListView.as_view(), name='admin-hospitals-pending'),
    path('admin/hospitals/verify/<int:hospital_id>/', admin_views.HospitalVerifyView.as_view(), name='admin-hospital-verify'),
    path('admin/hospitals/registry/', admin_views.HospitalRegistryView.as_view(), name='admin-hospital-registry'),
    path('admin/hospitals/status/<int:hospital_id>/', admin_views.HospitalStatusToggleView.as_view(), name='admin-hospital-status'),

    # Module 2: Identity & Verification
    path('admin/verification/logs/', admin_views.VerificationLogListView.as_view(), name='admin-verification-logs'),
    path('admin/verification/conflicts/', admin_views.IdentityConflictListView.as_view(), name='admin-verification-conflicts'),
    path('admin/verification/analytics/', admin_views.KYCAnalyticsView.as_view(), name='admin-verification-analytics'),

    # Module 3: Security & Audit
    path('admin/audit/trail/', admin_views.GlobalAuditTrailView.as_view(), name='admin-audit-trail'),
    path('admin/security/alerts/', admin_views.SecurityAlertListView.as_view(), name='admin-security-alerts'),
    path('admin/correction-requests/', admin_views.DataCorrectionRequestView.as_view(), name='admin-correction-requests'),

    # Module 4: System Config
    path('admin/config/', admin_views.SystemConfigView.as_view(), name='admin-config'),
    path('admin/api-keys/', admin_views.APIKeyManagementView.as_view(), name='admin-api-keys'),
    path('admin/ussd/status/', admin_views.USSDStatusView.as_view(), name='admin-ussd-status'),

    # Module 5: Support
    path('admin/support/tickets/', admin_views.SupportTicketListView.as_view(), name='admin-support-tickets'),
    path('admin/staff/sub-admins/', admin_views.SubAdminManagementView.as_view(), name='admin-sub-admins'),
]
