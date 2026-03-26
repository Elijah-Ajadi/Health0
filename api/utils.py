from .models import AuditLog, SecurityAlert, IdentityVerificationLog
from django.utils import timezone
from datetime import timedelta

def log_audit(actor, action, patient=None, resource_type=None, resource_id=None, details="", ip_address=None):
    """
    Utility to create an AuditLog entry.
    """
    AuditLog.objects.create(
        actor=actor,
        action=action,
        patient=patient,
        resource_type=resource_type,
        resource_id=resource_id,
        details=details,
        ip_address=ip_address
    )

def check_security_breach(user, ip_address):
    """
    Checks if a user/IP has performed too many verifications in the last hour.
    """
    one_hour_ago = timezone.now() - timedelta(hours=1)
    
    # Count verifications by this user or IP in the last hour
    if user and user.is_authenticated:
        count = IdentityVerificationLog.objects.filter(
            user=user, 
            timestamp__gte=one_hour_ago
        ).count()
    else:
        count = IdentityVerificationLog.objects.filter(
            ip_address=ip_address, 
            timestamp__gte=one_hour_ago
        ).count()
        
    if count >= 50:
        SecurityAlert.objects.create(
            severity=SecurityAlert.Severity.CRITICAL,
            message=f"Potential Scraping/Breach: {'User ' + user.username if user and user.is_authenticated else 'IP ' + str(ip_address)} performed {count} NIN verifications in the last hour."
        )
        return True
    return False
