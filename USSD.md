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

## 4. The Logic (State Machine)
The server processes the `text` field to determine the current state of the interaction:
* **Empty string (`""`):** The initial dial. The server responds with the **Main Menu**.
* **`"1"`:** The user selected the first option. The server responds with a prompt for a **Health PIN**.
* **`"1*1234"`:** The user selected option 1 and then entered "1234". The server verifies the PIN and provides the requested data.

See `api/ussd_logic.py` for the implementation of this state machine.

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
4. **Health0 API** processes logic $\rightarrow$ Returns `CON` or `END`
5. **USSD Gateway** $\rightarrow$ **User's Phone**
