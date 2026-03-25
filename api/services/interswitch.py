import requests
import json
import base64
from django.conf import settings

class InterswitchService:
    """
    Service to handle Identity Verification via Interswitch API.
    """
    
    @classmethod
    def get_access_token(cls):
        """
        Authenticate with Interswitch Passport to get OAuth2 token.
        """
        client_id = settings.INTERSWITCH_CLIENT_ID
        client_secret = settings.INTERSWITCH_CLIENT_SECRET
        url = settings.INTERSWITCH_OAUTH_URL
        
        if not client_id or not client_secret:
            print("ERROR: Interswitch Client ID or Secret missing in settings.")
            return None

        # Use requests built-in auth for cleaner Basic Auth header creation
        from requests.auth import HTTPBasicAuth
        auth = HTTPBasicAuth(client_id, client_secret)
        
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        payload = {
            "grant_type": "client_credentials",
            "scope": "profile"
        }

        try:
            print(f"DEBUG: Attempting Interswitch Auth at {url}")
            print(f"DEBUG: Using Client ID: {client_id[:5]}...") # Log partial ID for safety
            
            response = requests.post(
                url, 
                headers=headers, 
                data=payload, 
                auth=auth, # This handles the 'Authorization: Basic ...' header
                timeout=15
            )
            
            print(f"DEBUG: Interswitch Auth Status: {response.status_code}")
            if response.status_code == 200:
                token = response.json().get('access_token')
                if token:
                    return token
                else:
                    print(f"DEBUG: No access_token in response: {response.text}")
            else:
                print(f"DEBUG: Interswitch Auth Failed: {response.text}")
            return None
        except Exception as e:
            print(f"Interswitch Auth Exception: {str(e)}")
            return None

    @classmethod
    def verify_nin(cls, nin):
        """
        Verify NIN and return associated profile data.
        """
        # NO MOCK - Forcing live verification for all NINs
        
        token = cls.get_access_token()
        if not token:
            return {
                "status": "error",
                "message": "Failed to authenticate with Interswitch Passport"
            }

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        # Interswitch "NIN Full Details API" endpoint path
        base = settings.INTERSWITCH_BASE_URL.rstrip('/')
        url = f"{base}/verify/identity/nin/verify" 
        payload = {"id": nin}
        
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=15)
            if response.status_code == 200:
                resp_data = response.json()
                # The "Full Details" API returns a nested 'data' object
                actual_data = resp_data.get('data', resp_data)
                return {
                    "status": "success",
                    "data": actual_data
                }
            else:
                return {
                    "status": "error",
                    "message": f"Interswitch Error ({response.status_code}): {response.text}"
                }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Connection Error: {str(e)}"
            }
