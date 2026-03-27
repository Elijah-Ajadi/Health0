import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'health0.settings')
django.setup()

from api.models import User, PatientProfile, HospitalProfile
from django.contrib.auth.hashers import make_password

def setup_demo():
    # 1. Admin
    admin, created = User.objects.get_or_create(username='demo_admin')
    admin.email = 'admin@health0.com'
    admin.role = User.Role.ADMIN
    admin.is_staff = True
    admin.is_superuser = True
    admin.password = make_password('health0_pass')
    admin.save()
    print(f"{'Created' if created else 'Updated'} admin: demo_admin")

    # 2. Patient
    patient, created = User.objects.get_or_create(username='demo_patient')
    patient.email = 'patient@health0.com'
    patient.role = User.Role.PATIENT
    patient.password = make_password('health0_pass')
    patient.save()
    
    # Use a unique NIN that won't conflict with 'jane49'
    PatientProfile.objects.update_or_create(
        user=patient,
        defaults={
            'phone_number': '08000000001',
            'address': '001 Demo Patient Way, Digital Sanctuary',
            'nin': '00000000001', 
            'nin_verified': True,
            'dob': '1990-01-01',
            'gender': 'MALE'
        }
    )
    print(f"{'Created' if created else 'Updated'} patient: demo_patient")

    # 3. Hospital
    hospital, created = User.objects.get_or_create(username='demo_hospital')
    hospital.email = 'demo_hospital@health0.com'
    hospital.role = User.Role.HOSPITAL
    hospital.password = make_password('health0_pass')
    hospital.save()
    
    HospitalProfile.objects.update_or_create(
        user=hospital,
        defaults={
            'hospital_name': 'Demo Sanctuary Hospital',
            'category': HospitalProfile.Category.PRIVATE,
            'address': '002 Hospital Blvd, Digital Sanctuary',
            'contact_email': 'demo_hospital@health0.com',
            'contact_phone': '08000000002',
            'cac_number': 'DEMO-CAC-001',
            'hefamaa_id': 'DEMO-HEF-001',
            'status': HospitalProfile.Status.ACTIVE
        }
    )
    print(f"{'Created' if created else 'Updated'} hospital: demo_hospital")

if __name__ == '__main__':
    setup_demo()
