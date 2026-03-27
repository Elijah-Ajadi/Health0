import random
import string
from django.utils import timezone
from datetime import timedelta
from .models import PatientProfile, HealthRecord, EmergencyToken, DeliveryRequest, User

def handle_ussd(phone_number, text):
    """
    Refined USSD state machine for Health0 with PIN authentication.
    """
    # 1. Normalize phone number and find patient
    search_number = phone_number
    if phone_number.startswith('+234'):
        search_number_alt = '0' + phone_number[4:]
    else:
        search_number_alt = phone_number
        
    patient = PatientProfile.objects.filter(phone_number__in=[search_number, search_number_alt]).first()
    
    # 2. Handle Non-Registered Users
    if not patient:
        return handle_unregistered_menu(text)

    # 3. Handle Registered Users
    return handle_registered_menu(patient, text)

def handle_unregistered_menu(text):
    levels = text.split('*') if text else []
    
    if not text:
        response = "CON Welcome to Health0\n"
        response += "1. Register\n"
        response += "2. About Health0\n"
        response += "3. Support"
        return response
    
    choice = levels[0]
    if choice == "1":
        return "END Please visit https://health0.onrender.com to register or download our Mobile App."
    elif choice == "2":
        return "END Health0 is your Decentralized Health Ledger. We provide a unified clinical history accessible anywhere, even offline."
    elif choice == "3":
        return "END Contact Support:\nEmail: support@health0.com\nPhone: +234 800 HEALTH0"
    else:
        return "END Invalid option. Please try again."

def handle_registered_menu(patient, text):
    levels = text.split('*') if text else []
    
    if not text:
        response = f"CON Welcome to Health0, {patient.user.first_name}\n"
        response += "1. Get Health Data Summary\n"
        response += "2. Send Summary to 3rd party\n"
        response += "3. Request Health Data Delivery (Physical)\n"
        response += "4. Request Health Data to Email\n"
        response += "5. Change Pin"
        return response

    choice = levels[0]

    # --- Choice 1: Get Summary (1 -> 1*PIN) ---
    if choice == "1":
        if len(levels) == 1:
            return "CON Enter your 4-digit Health PIN to view summary:"
        elif len(levels) == 2:
            input_pin = levels[1]
            if input_pin == patient.health_pin:
                status = f"Blood Group: {patient.blood_group or 'N/A'}\n"
                status += f"Genotype: {patient.genotype or 'N/A'}\n"
                status += f"Allergies: {patient.allergies or 'None'}"
                return "END Health Summary:\n" + status
            else:
                return "END Authentication failed. Incorrect PIN."

    # --- Choice 2: Send to 3rd party (2 -> 2*Phone/Email -> 2*Phone/Email*PIN) ---
    elif choice == "2":
        if len(levels) == 1:
            return "CON Enter 3rd party phone number or email:"
        elif len(levels) == 2:
            target = levels[1]
            return f"CON Enter your 4-digit PIN to authorize sending to {target}:"
        elif len(levels) == 3:
            target = levels[1]
            input_pin = levels[2]
            if input_pin == patient.health_pin:
                # Log the delivery/transfer
                DeliveryRequest.objects.create(
                    patient=patient,
                    delivery_type=DeliveryRequest.DeliveryType.EMAIL if '@' in target else DeliveryRequest.DeliveryType.PHYSICAL,
                    address_or_email=target,
                    status=DeliveryRequest.Status.PROCESSING
                )
                return f"END Success! Your health summary has been sent to {target}."
            else:
                return "END Authentication failed. Incorrect PIN."

    # --- Choice 3: Physical Delivery (3 -> 3*PIN) ---
    elif choice == "3":
        if len(levels) == 1:
            return f"CON Request delivery to {patient.address[:20]}...\nEnter PIN to confirm:"
        elif len(levels) == 2:
            input_pin = levels[1]
            if input_pin == patient.health_pin:
                DeliveryRequest.objects.create(
                    patient=patient,
                    delivery_type=DeliveryRequest.DeliveryType.PHYSICAL,
                    address_or_email=patient.address,
                    status=DeliveryRequest.Status.PENDING
                )
                return "END Success! Your health data delivery request has been logged."
            else:
                return "END Authentication failed. Incorrect PIN."

    # --- Choice 4: Email Delivery (4 -> 4*PIN) ---
    elif choice == "4":
        if len(levels) == 1:
            return f"CON Request delivery to {patient.user.email}?\nEnter PIN to confirm:"
        elif len(levels) == 2:
            input_pin = levels[1]
            if input_pin == patient.health_pin:
                DeliveryRequest.objects.create(
                    patient=patient,
                    delivery_type=DeliveryRequest.DeliveryType.EMAIL,
                    address_or_email=patient.user.email,
                    status=DeliveryRequest.Status.PENDING
                )
                return "END Success! Your health data has been sent to your email."
            else:
                return "END Authentication failed. Incorrect PIN."

    # --- Choice 5: Change Pin (5 -> 5*NIN -> 5*NIN*NewPIN) ---
    elif choice == "5":
        if len(levels) == 1:
            return "CON Enter your 11-digit NIN to verify identity:"
        elif len(levels) == 2:
            input_nin = levels[1]
            if input_nin == patient.nin:
                return "CON NIN Verified! Enter your new 4-digit Health PIN:"
            else:
                return "END Verification failed. Incorrect NIN."
        elif len(levels) == 3:
            input_nin = levels[1]
            new_pin = levels[2]
            if input_nin == patient.nin and len(new_pin) == 4 and new_pin.isdigit():
                patient.health_pin = new_pin
                patient.save()
                return "END Success! Your Health PIN has been updated."
            else:
                return "END Error: NIN mismatch or invalid PIN format."

    return "END Invalid option. Dial *384*11911# to restart."
