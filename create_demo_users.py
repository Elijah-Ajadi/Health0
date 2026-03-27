import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'health0.settings')
django.setup()

from api.models import User, PatientProfile, HospitalProfile

def create_demo_users():
    # 1. Create Admin
    admin_user, created = User.objects.get_or_create(
        username='demo_admin',
        defaults={
            'email': 'admin@health0.com',
            'role': User.Role.ADMIN,
            'is_staff': True,
            'is_superuser': True,
            'first_name': 'System',
            'last_name': 'Administrator'
        }
    )
    if created:
        admin_user.set_password('health0_pass')
        admin_user.save()
        print("Admin user created: demo_admin")
    else:
        print("Admin user already exists")

    # 2. Create Patient
    patient_user, created = User.objects.get_or_create(
        username='demo_patient',
        defaults={
            'email': 'patient@health0.com',
            'role': User.Role.PATIENT,
            'first_name': 'John',
            'last_name': 'Doe'
        }
    )
    if created:
        patient_user.set_password('health0_pass')
        patient_user.save()
        PatientProfile.objects.create(
            user=patient_user,
            phone_number='08012345678',
            address='123 Patient Street, Lagos',
            nin='12345678901',
            nin_verified=True,
            dob='1990-01-01',
            gender='MALE'
        )
        print("Patient user created: demo_patient")
    else:
        print("Patient user already exists")

    # 3. Create Hospital
    hospital_user, created = User.objects.get_or_create(
        username='demo_hospital',
        defaults={
            'email': 'contact@stjude.com',
            'role': User.Role.HOSPITAL,
            'first_name': 'St. Jude',
            'last_name': 'General'
        }
    )
    if created:
        hospital_user.set_password('health0_pass')
        hospital_user.save()
        HospitalProfile.objects.create(
            user=hospital_user,
            hospital_name='St. Jude General Hospital',
            category=HospitalProfile.Category.PRIVATE,
            address='45 Hospital Road, Ikeja',
            contact_email='contact@stjude.com',
            contact_phone='08098765432',
            cac_number='RC123456',
            hefamaa_id='HEF/2026/001',
            status=HospitalProfile.Status.ACTIVE
        )
        print("Hospital user created: demo_hospital")
    else:
        print("Hospital user already exists")

if __name__ == '__main__':
    create_demo_users()
