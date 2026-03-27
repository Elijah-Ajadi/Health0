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
            return None
        except Exception as e:
            print(f"Interswitch Auth Exception: {str(e)}")
            return None

    @classmethod
    def verify_nin(cls, nin):
        """
        Public method to verify NIN.
        """
        clean_nin = str(nin).strip()
        return cls._live_verify_nin(clean_nin)

    @classmethod
    def _live_verify_nin(cls, nin):
        """
        Core logic to call the Interswitch Marketplace NIN Full Details API.
        """
        token = cls.get_access_token()
        if not token:
            return {"status": "error", "message": "Authentication failed."}

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        base = settings.INTERSWITCH_BASE_URL.rstrip('/')
        url = f"{base}/verify/identity/nin/verify" 
        
        # REQUIRED: 'consent' must be true for full details retrieval.
        # Including both 'id' and 'nin' keys to ensure proxy compatibility.
        payload = {
            "id": nin,
            "nin": nin,
            "consent": True
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=20)
            
            # CHECKPOINT: If we get a 500, we fallback to the Sarah Jane Doe mockup as requested.
            if response.status_code >= 500:
                print(f"DEBUG: Interswitch 500 detected. Falling back to SARAH JANE DOE mock data.")
                mock_data = {
                    "id": "681904045f90906dc87f332d",
                    "address": {
                        "town": "SULEJA",
                        "lga": "Suleja",
                        "state": "Niger",
                        "addressLine": "13B Fake Street, Ilupeju Niger State"
                    },
                    "status": "found",
                    "firstName": "Sarah",
                    "middleName": "Jane",
                    "lastName": "Doe",
                    "image": "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/2wCEAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8",
                    "signature": "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIcSUNDX1BST0ZJTEUAAQEAAAIMbGNtcwIQAABtbnRyUkdCI",
                    "mobile": "08000000000",
                    "dateOfBirth": "1988-04-04",
                    "gender": "f",
                    "idNumber": nin, # Preserve the input NIN
                    "type": "nin"
                }
                return {
                    "status": "success",
                    "data": mock_data
                }

            if response.status_code == 200:
                resp_data = response.json()
                return {
                    "status": "success",
                    "data": resp_data.get('data', resp_data)
                }
            
            # Capture the logId for debugging if the error persists
            try:
                error_response = response.json()
            except:
                error_response = {"message": response.text}
                
            log_id = error_response.get('logId', 'N/A')
            
            return {
                "status": "error",
                "message": f"Verification failed (Status {response.status_code}).",
                "log_id": log_id,
                "details": error_response.get('message', 'No message provided')
            }

        except Exception as e:
            return {"status": "error", "message": f"Connection Error: {str(e)}"}