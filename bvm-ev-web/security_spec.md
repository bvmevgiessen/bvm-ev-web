# Security Specification: BVM Portal Firestore

This document defines the security boundaries, schemas, and access controls for the Cloud Firestore database integrated into the Bildung und Verständigung Mittelhessen e.V. (BVM) Vereinsportal.

---

## 1. Collections & Access Control Policies

The Firestore database defines three primary paths. We enforce a **Default Deny** catch-all safety net for all other paths.

### Catch-All
* **Path:** `/{document=**}`
* **Write Policy:** Denied to everyone.
* **Read Policy:** Denied to everyone.

### Collection: `users`
* **Path:** `/users/{userId}`
* **Document ID Type:** Strict alphanumeric ID check (`isValidId`).
* **Read Policy:** Allowed if the user is authenticated and `request.auth.uid == userId`.
* **Write Policy:** Allowed if the user is authenticated and `request.auth.uid == userId`.
* **Validation Schema:**
  * `completedModules` must be an array of strings.

### Collection: `survey_responses`
* **Path:** `/survey_responses/{responseId}`
* **Document ID Type:** Strict alphanumeric ID check (`isValidId`).
* **Read Policy:** Denied to all clients.
* **Write (Create) Policy:** Allowed for any user (even unauthenticated) to submit a survey response.
* **Write (Update/Delete) Policy:** Denied to all clients.

### Collection: `survey_settings`
* **Path:** `/survey_settings/{settingId}`
* **Document ID Type:** Only the ID `config` is valid for reads and writes.
* **Read (Get) Policy:** Allowed for any user (even unauthenticated) to retrieve the connection settings (`taetigkeitsberichtGasUrl` and `googleSpreadsheetUrl`).
* **Read (List) Policy:** Denied (no blanket listing/scraping).
* **Write (Create/Update) Policy:** Only allowed if the user is authenticated, has a verified email address, and their email matches the bootstrapped administrator email `bvmevgiessen@gmail.com`.
* **Write (Delete) Policy:** Denied.
* **Validation Schema (`isValidSetting`):**
  * `googleSheetsUrl`: optional string, max size 1000 characters.
  * `googleSpreadsheetUrl`: optional string, max size 1000 characters.
  * `taetigkeitsberichtGasUrl`: optional string, max size 1000 characters.
  * `updatedAt`: optional string, max size 100 characters.

---

## 2. Test Suite Specification (The "Dirty Dozen" Payloads)

We test the security boundaries using the following scenarios:

| Case | Actor | Path | Operation | Payload | Expected Result | Why |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| T01 | Unauthenticated | `/survey_settings/config` | `get` | - | **ALLOW** | Public needs to fetch Apps Script URL to sync forms. |
| T02 | Unauthenticated | `/survey_settings/config` | `list` | - | **DENY** | No blanket listings of configuration files. |
| T03 | Unauthenticated | `/survey_settings/config` | `write` | `{ "taetigkeitsberichtGasUrl": "http://evil.com" }` | **DENY** | Anonymous users cannot change connection URLs. |
| T04 | Unauthenticated | `/survey_settings/hacker_doc` | `get` | - | **DENY** | Only the specific `config` document ID is accessible. |
| T05 | Random Authenticated (`test@example.com`) | `/survey_settings/config` | `write` | `{ "taetigkeitsberichtGasUrl": "http://evil.com" }` | **DENY** | Authenticated users without admin emails are blocked. |
| T06 | Admin (`bvmevgiessen@gmail.com` Unverified) | `/survey_settings/config` | `write` | `{ "taetigkeitsberichtGasUrl": "http://good.com" }` | **DENY** | Verified email token is required (`email_verified == true`). |
| T07 | Verified Admin (`bvmevgiessen@gmail.com`) | `/survey_settings/config` | `write` | `{ "taetigkeitsberichtGasUrl": "https://script.google.com/...", "updatedAt": "2026-07-15..." }` | **ALLOW** | Authorised admin submitting valid payloads. |
| T08 | Verified Admin (`bvmevgiessen@gmail.com`) | `/survey_settings/config` | `write` | `{ "taetigkeitsberichtGasUrl": 12345 }` | **DENY** | Type violation (`taetigkeitsberichtGasUrl` must be string). |
| T09 | Verified Admin (`bvmevgiessen@gmail.com`) | `/survey_settings/config` | `delete` | - | **DENY** | Config deletion is disabled. |
| T10 | Authenticated User (`user_abc`) | `/users/user_abc` | `write` | `{ "completedModules": ["mod_1"] }` | **ALLOW** | Own profile read/write. |
| T11 | Authenticated User (`user_abc`) | `/users/user_xyz` | `write` | `{ "completedModules": ["mod_1"] }` | **DENY** | Cross-profile access violation. |
| T12 | Unauthenticated | `/survey_responses/response_123` | `create` | `{ "tech_has_bugs": false }` | **ALLOW** | Anonymous survey submissions allowed. |
