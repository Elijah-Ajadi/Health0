# USSD System Overview (Health0)

This document explains how the USSD (Unstructured Supplementary Service Data) system works within the Health0 ecosystem.

## 1. The Interaction (User Side)
When a user dials a code like `*384*11911#` on their mobile phone, they are opening a real-time session with the mobile network.
* **Offline Access:** Unlike mobile apps, USSD does not require an internet connection or a data plan.
* **Compatibility:** It works on both modern smartphones and basic "feature phones."

## 2. The Gateway (The Middleman)
The mobile network routes the request to a USSD Gateway (e.g., **Africa's Talking**). The gateway acts as a bridge between the telecommunications network and the Health0 web server.

## 3. The Callback (The Server Side)
The Gateway sends an HTTP POST request to the Health0 server at the `/api/ussd/` endpoint. This request typically contains:
* **phoneNumber:** The mobile number of the user.
* **text:** A string representing the user's inputs during the session (e.g., `"1*1234"`).
* **sessionId:** A unique identifier for the current session.

## 4. Understanding the Code (`api/ussd_logic.py`)
This file contains the "brains" of the USSD system. It is broken down into three main parts:

### A. The Entry Point (`handle_ussd`)
Whenever a request comes in, this function starts the process.
1. It identifies the user by their **phone number**.
2. It checks if the user is already registered in the Health0 database.
3. If they are registered, it shows the **Registered Menu**. If not, it shows the **Unregistered Menu**.

### B. The Unregistered Menu (`handle_unregistered_menu`)
For people who haven't signed up yet, this menu provides:
* Information about Health0.
* Contact details for support.
* Instructions on how to register (usually via the mobile app or website).

### C. The Registered Menu (`handle_registered_menu`)
This is the core of the service for patients. Once they dial in, they can perform several actions securely using their **Health PIN**:
1. **Get Health Data Summary:** Quickly view blood group, genotype, and allergies.
2. **Send Summary to 3rd Party:** Send their health details to another person's phone or email.
3. **Request Physical Delivery:** Ask for a physical copy of their medical records to be sent to their home.
4. **Request Email Delivery:** Have their full health history sent to their registered email.
5. **Change PIN:** Securely update their 4-digit Health PIN using their NIN (National Identification Number) for verification.

## 5. The Response (CON vs END)
The server communicates back to the gateway using plain text responses prefixed with specific commands:
* **`CON` (Continue):** Keeps the session active. It displays a message and an input field on the user's phone.
  * *Example:* `CON Enter your 4-digit Health PIN:`
* **`END` (End):** Displays a final message and terminates the session.
  * *Example:* `END Your request has been processed successfully.`

## Summary Flow
1. **User** dials code $\rightarrow$ **Mobile Network**
2. **Mobile Network** $\rightarrow$ **USSD Gateway**
3. **USSD Gateway** $\rightarrow$ **Health0 API** (`/api/ussd/`)
4. **Health0 API** processes logic in `ussd_logic.py` $\rightarrow$ Returns `CON` or `END`
5. **USSD Gateway** $\rightarrow$ **User's Phone**
