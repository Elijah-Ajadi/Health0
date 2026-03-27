import requests
import json
from django.conf import settings
from requests.auth import HTTPBasicAuth

class InterswitchService:
    """
    Service to handle Identity Verification via Interswitch API.
    Ref: NIN Full Details API (Marketplace Routing)
    """
    
    @classmethod
    def get_access_token(cls):
        """
        Authenticate with Interswitch Passport to get OAuth2 token.
        """
        client_id = getattr(settings, 'INTERSWITCH_CLIENT_ID', None)
        client_secret = getattr(settings, 'INTERSWITCH_CLIENT_SECRET', None)
        url = getattr(settings, 'INTERSWITCH_OAUTH_URL', "https://qa.interswitchng.com/passport/oauth/token")
        
        if not client_id or not client_secret:
            print("ERROR: Interswitch Client ID or Secret missing in settings.")
            return None

        # Use HTTPBasicAuth for the 'Authorization: Basic ...' header
        auth = HTTPBasicAuth(client_id, client_secret)
        
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        payload = {
            "grant_type": "client_credentials",
            "scope": "profile"
        }

        try:
            print(f"DEBUG: Requesting token from {url}")
            response = requests.post(
                url, 
                headers=headers, 
                data=payload, 
                auth=auth, 
                timeout=15
            )
            
            if response.status_code == 200:
                token = response.json().get('access_token')
                if token:
                    return token
                print(f"DEBUG: No access_token in response: {response.text}")
            else:
                print(f"DEBUG: Auth Failed ({response.status_code}): {response.text}")
            return None
        except Exception as e:
            print(f"Interswitch Auth Exception: {str(e)}")
            return None

    @classmethod
    def verify_nin(cls, nin):
        """
        Public method to verify NIN.
        Ensures NIN is passed as a string and handles logic routing.
        """
        clean_nin = str(nin).strip()
        client_id = getattr(settings, 'INTERSWITCH_CLIENT_ID', '')
        
        # If no Client ID is provided, use structured mock for development
        if not client_id:
            print(f"DEBUG: No Interswitch ID found. Using structured mock for NIN: {clean_nin}")
            return cls._mock_verify_nin(clean_nin)
            
        print(f"DEBUG: Initiating verification for NIN: {clean_nin}")
        return cls._live_verify_nin(clean_nin)

    @classmethod
    def _mock_verify_nin(cls, nin):
        """
        Structured mock for development/testing when API keys are missing.
        """
        # Success case for specific test NINs or any 11-digit number
        if len(nin) == 11:
            return {
                "status": "success",
                "data": {
                    "firstName": "Jane",
                    "lastName": "Doe",
                    "middleName": "Health",
                    "gender": "Female",
                    "dateOfBirth": "1994-05-12",
                    "nin": nin,
                    "phone": "08012345678",
                    "signature": "mock_sig_123"
                }
            }
        return {
            "status": "error",
            "message": "Invalid NIN format. Must be 11 digits."
        }

    @classmethod
    def _live_verify_nin(cls, nin):
        """
        Core logic to call the Interswitch Marketplace NIN Full Details API.
        """
        token = cls.get_access_token()
        if not token:
            return {
                "status": "error",
                "message": "Authentication with Interswitch failed."
            }

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        # Format the URL correctly
        base = settings.INTERSWITCH_BASE_URL.rstrip('/')
        url = f"{base}/verify/identity/nin/verify" 
        
        # PAYLOAD FIX:
        # 1. 'id' is used per your marketplace snippet, but 'nin' is often required as an alias.
        # 2. 'consent' is MANDATORY for Full Details retrieval.
        payload = {
            "id": nin,
            "nin": nin,  # Including both to ensure compatibility
            "consent": True
        }
        
        try:
            print(f"DEBUG: Sending Request to: {url}")
            response = requests.post(url, headers=headers, json=payload, timeout=20)
            
            # Interswitch often returns 200 for success, but can return 400/500 for errors
            if response.status_code == 200:
                resp_data = response.json()
                # The data usually nested under a 'data' key or returned directly
                actual_data = resp_data.get('data', resp_data)
                return {
                    "status": "success",
                    "data": actual_data
                }
            
            # If we get a 500 or other error, capture the logId for support
            error_response = response.json() if response.text else {}
            log_id = error_response.get('logId', 'N/A')
            
            print(f"DEBUG: Interswitch API Error. Status: {response.status_code}, LogID: {log_id}")
            
            return {
                "status": "error",
                "message": f"Verification failed (Status {response.status_code}).",
                "details": error_response.get('message', 'No message provided'),
                "log_id": log_id
            }

        except requests.exceptions.Timeout:
            return {"status": "error", "message": "The request to Interswitch timed out."}
        except Exception as e:
            return {"status": "error", "message": f"An unexpected error occurred: {str(e)}"}