from django.urls import path
from .views import RegisterView, LoginView, ProfileView, VerifyNINView, HealthRecordView, HospitalPatientSearchView, HospitalPatientDetailView, DeliveryRequestView, HospitalAnalyticsView, AppointmentView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('verify-nin/', VerifyNINView.as_view(), name='verify-nin'),
    path('records/', HealthRecordView.as_view(), name='records'),
    path('hospital/search/', HospitalPatientSearchView.as_view(), name='hospital-search'),
    path('hospital/patient/<int:patient_id>/', HospitalPatientDetailView.as_view(), name='hospital-patient-detail'),
    path('hospital/analytics/', HospitalAnalyticsView.as_view(), name='hospital-analytics'),
    path('appointments/', AppointmentView.as_view(), name='appointments'),
    path('delivery-request/', DeliveryRequestView.as_view(), name='delivery-request'),
]
