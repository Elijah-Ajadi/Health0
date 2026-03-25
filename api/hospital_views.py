from rest_framework import status, views, response, permissions
from django.db import transaction
from .models import User, HospitalProfile
from .serializers import UserSerializer
from django.core.files.storage import default_storage

class HospitalSignupView(views.APIView):
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        data = request.data
        
        # 1. Duplicate Detection
        cac_number = data.get('cac_number')
        hefamaa_id = data.get('hefamaa_id')
        
        if HospitalProfile.objects.filter(cac_number=cac_number).exists():
            return response.Response(
                {'error': f'A facility with CAC Number {cac_number} is already registered.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if hefamaa_id and HospitalProfile.objects.filter(hefamaa_id=hefamaa_id).exists():
            return response.Response(
                {'error': f'A facility with HEFAMAA ID {hefamaa_id} is already registered.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Create Admin User
        admin_email = data.get('admin_email')
        admin_phone = data.get('admin_phone')
        username = data.get('username')
        
        if User.objects.filter(username=username).exists():
             return response.Response({'error': f'Username {username} is already taken.'}, status=status.HTTP_400_BAD_REQUEST)
             
        admin_name = data.get('admin_name', '').split(' ')
        first_name = admin_name[0]
        last_name = ' '.join(admin_name[1:]) if len(admin_name) > 1 else ''
        
        try:
            user = User.objects.create_user(
                username=username,
                email=admin_email,
                password=data.get('password'), # In Phase 3, they will be forced to setup MFA
                first_name=first_name,
                last_name=last_name,
                role=User.Role.HOSPITAL
            )
        except Exception as e:
            return response.Response({'error': f'User creation failed: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        # 3. Create Hospital Profile
        try:
            profile = HospitalProfile.objects.create(
                user=user,
                hospital_name=data.get('hospital_name'),
                category=data.get('category'),
                cac_number=cac_number,
                tin=data.get('tin'),
                hefamaa_id=hefamaa_id,
                director_name=data.get('director_name'),
                mdcn_number=data.get('mdcn_number'),
                director_license_expiry=data.get('director_license_expiry'),
                address=data.get('address'),
                contact_email=admin_email,
                contact_phone=admin_phone,
                status=HospitalProfile.Status.PENDING
            )
            
            # Handle Files (if any were sent in the multipart request)
            if 'cac_document' in request.FILES:
                profile.cac_document = request.FILES['cac_document']
            if 'hefamaa_license' in request.FILES:
                profile.hefamaa_license = request.FILES['hefamaa_license']
            if 'letter_of_intent' in request.FILES:
                profile.letter_of_intent = request.FILES['letter_of_intent']
            if 'proof_of_address' in request.FILES:
                profile.proof_of_address = request.FILES['proof_of_address']
            
            profile.save()
            
        except Exception as e:
            user.delete() # Rollback user
            return response.Response({'error': f'Profile creation failed: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        return response.Response({
            'status': 'PENDING',
            'message': 'Thank you for applying. Our Admin team is currently vetting your medical licenses. This usually takes 24–48 hours.',
            'hospital_id': profile.id
        }, status=status.HTTP_201_CREATED)
