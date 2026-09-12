# Authentication experience — frontend-template

> เอกสารนี้กำหนดหน้า authentication แบบสองภาษาที่ route `/{locale}/auth` และการเชื่อมกับ `api-template` ผ่าน generated client ณ วันที่ 2026-09-12
> ขอบเขตครอบคลุมการเข้าสู่ระบบ สมัครสมาชิก bootstrap session ดูบัญชี/สิทธิ์ จัดการ session และออกจากระบบ โดยไม่เก็บ token ใน persistent client storage

## 1. Actors & Systems

| System | Responsibility | Ownership |
| --- | --- | --- |
| ผู้ใช้ | กรอกข้อมูล เลือกขอบเขต logout และยืนยัน revoke session | บุคคลภายนอก trust boundary |
| `frontend-template` | แสดง UI, validation เพื่อ UX, เก็บ access token/CSRF ใน memory และเรียก API | repository นี้ |
| `api-template` | ตรวจ credential, ออก JWE, จัดการ refresh cookie, session, role และ permission | backend repository |

Trust boundary อยู่ที่ API: frontend ห้ามถือว่า role/permission ที่แสดงผลเป็นหลักฐานอนุญาตการกระทำ และห้ามเก็บ access token หรือ CSRF token ใน Redux, `localStorage`, `sessionStorage`, URL หรือ log

## 2. End-to-end overview

```text
[ผู้ใช้] เปิด /{locale}/auth
   |
   v frontend-template: AuthProvider bootstrap (POST /api/auth/refresh)
   |
   +--(anonymous/unavailable) แสดง Sign in และ Register
   |     |
   |     +-- POST /api/auth/login หรือ POST /api/auth/register
   |     `-- สำเร็จ -> เก็บ token ใน memory และแสดง account dashboard
   |
   `--(authenticated) แสดง account, roles, permissions และ sessions
         |
         +-- GET /api/auth/me และ GET /api/auth/sessions
         +-- DELETE /api/auth/sessions/{sessionId} หลังยืนยัน
         `-- POST /api/auth/logout ด้วย CURRENT_DEVICE หรือ ALL_DEVICES
```

**หัวใจ:** refresh token อยู่ใน HttpOnly cookie และ API เป็น authority ของ authorization; frontend มีหน้าที่ทำ flow ให้ลื่นไหลและแสดงสถานะที่เชื่อถือได้จาก API เท่านั้น

## 3. Step-by-step

### STEP 1 — เปิดหน้าและ bootstrap session

**System:** `frontend-template` → `api-template`

- `AuthProvider` เรียก `POST /api/auth/refresh` หนึ่งครั้งเมื่อ mount
- ระหว่างรอแสดง skeleton เพื่อไม่ให้ฟอร์มกระพริบก่อนรู้สถานะจริง
- เมื่อสำเร็จเก็บ JWE/CSRF ใน module memory และเก็บเฉพาะ `AuthAccountDto` ใน Redux
- เมื่อ API ตอบ `401` เปลี่ยนเป็น `anonymous`
- เมื่อ network/API ขัดข้องเปลี่ยนเป็น `unavailable` แสดงคำเตือน และยังแสดงฟอร์มเพื่อให้ retry ได้หลัง API กลับมา

### STEP 2 — Sign in

**System:** `frontend-template` → `api-template`

- ฟอร์มตรวจ email และ password ฝั่ง client เพื่อ feedback ที่เร็ว
- submit เรียก `POST /api/auth/login`
- ระหว่าง submit ปิดปุ่มและแสดง spinner เพื่อป้องกันการส่งซ้ำ
- เมื่อสำเร็จเปลี่ยนหน้าเดิมเป็น account dashboard โดยไม่ reload
- เมื่อไม่สำเร็จแสดงข้อความจาก `ProblemDetails` เมื่อมี หรือข้อความ fallback ที่ไม่เปิดเผยข้อมูลภายใน

### STEP 3 — Register

**System:** `frontend-template` → `api-template`

- ฟอร์มรับ `name`, `email`, `password` และยืนยัน password
- password ต้องยาวอย่างน้อย 12 ตัวอักษร และค่าการยืนยันต้องตรงกัน
- submit เฉพาะ `name`, `email`, `password` ไปยัง `POST /api/auth/register`
- เมื่อสำเร็จใช้ session response เดียวกับ login และเข้าสู่ account dashboard ทันที

### STEP 4 — แสดงบัญชีและสิทธิ์

**System:** `frontend-template`

- แสดงชื่อ email อักษรย่อ avatar, roles และ permissions จาก `AuthAccountDto`
- role/permission ใช้เพื่ออธิบายสถานะและปรับ UX เท่านั้น
- backend ต้องตรวจ authorization ซ้ำทุก endpoint เสมอ
- role-management CRUD, MFA, OAuth และ password reset อยู่นอกขอบเขตรอบนี้

### STEP 5 — โหลดและ revoke sessions

**System:** `frontend-template` → `api-template`

- TanStack Query เรียก `GET /api/auth/sessions` เมื่อ authenticated เท่านั้น
- แสดงเวลาสร้าง ใช้งานล่าสุด หมดอายุ และ badge สำหรับ current session
- current session ไม่แสดง action revoke; ให้ใช้ logout เพื่อป้องกัน state ค้าง
- session อื่นต้องเปิด confirmation dialog ก่อนเรียก `DELETE /api/auth/sessions/{sessionId}`
- เมื่อสำเร็จ invalidate query และโหลดรายการใหม่

### STEP 6 — Logout

**System:** `frontend-template` → `api-template`

- ผู้ใช้เลือก `CURRENT_DEVICE` หรือ `ALL_DEVICES` จาก Select
- เรียก `POST /api/auth/logout` พร้อม scope ที่เลือก
- ล้าง token ใน memory และ account ใน Redux แล้วแสดงฟอร์ม anonymous เสมอ แม้ server request ล้มเหลว เพื่อไม่ให้เครื่องปัจจุบันคง credential ที่ผู้ใช้สั่งล้าง
- หาก API ปฏิเสธหรือ network ขัดข้อง local logout ยังสำเร็จ; server อาศัยอายุของ token และ session policy จำกัดความเสี่ยงจนผู้ใช้เชื่อมต่อและ logout ใหม่ได้

## 4. State and data lifecycle

| State | UI | Stored data |
| --- | --- | --- |
| `loading` | skeleton | ไม่มี persistent token |
| `anonymous` | Sign in/Register | `account = null` |
| `unavailable` | warning + Sign in/Register | `account = null` |
| `authenticated` | account/session dashboard | Redux เก็บ account เท่านั้น; JWE/CSRF อยู่ใน memory |

Refresh token ถูกส่งและหมุนเวียนด้วย HttpOnly cookie จาก API จึงไม่เปิดให้ JavaScript อ่าน

## 5. API spec

### 5.1 `api-template` — endpoints ที่มีอยู่และนำมาใช้

#### POST /api/auth/refresh — bootstrap/rotate session

```jsonc
// Request: HttpOnly refresh cookie + x-csrf-token เมื่อ API กำหนด
// Response 200
{ "accessToken": "<compact-jwe>", "csrfToken": "<memory-only>", "account": { "id": "<uuid>", "email": "user@example.com", "name": "Example User", "roles": ["user"], "permissions": ["account:read"] } }
// Response 401: ไม่มี session ที่ใช้ได้
```

**Guard:** refresh cookie และ session ต้อง valid และไม่ถูก revoke
**Side effect:** หมุน refresh token/session ตามนโยบาย backend

#### POST /api/auth/login — เข้าสู่ระบบ

```jsonc
// Request
{ "email": "user@example.com", "password": "example-password" }
// Response 200: AuthSessionResponseDto
// Response 401: credential ไม่ถูกต้อง
```

**Guard:** backend ตรวจ credential และสถานะบัญชี
**Side effect:** สร้าง session และตั้ง refresh cookie

#### POST /api/auth/register — สมัครสมาชิก

```jsonc
// Request
{ "name": "Example User", "email": "user@example.com", "password": "at-least-12-characters" }
// Response 201: AuthSessionResponseDto
// Response 409: email ถูกใช้แล้ว
// Response 422: payload ไม่ผ่าน validation
```

**Guard:** backend ตรวจ uniqueness และ validation ซ้ำ
**Side effect:** สร้าง account, default role, session และ refresh cookie

#### GET /api/auth/sessions — ดู sessions ของบัญชีปัจจุบัน

```jsonc
// Response 200
[{ "id": "<uuid>", "current": true, "issuedAt": "2026-09-12T00:00:00.000Z", "lastUsedAt": "2026-09-12T00:00:00.000Z", "expiresAt": "2026-10-12T00:00:00.000Z" }]
// Response 401: access token ใช้ไม่ได้และ refresh ไม่สำเร็จ
```

**Guard:** authenticated account และ ownership ของ sessions
**Side effect:** ไม่มี

#### DELETE /api/auth/sessions/{sessionId} — revoke session อื่น

```jsonc
// Response 204
// Response 401: ไม่ authenticated
// Response 404: session ไม่มีอยู่หรือไม่ใช่ของบัญชีนี้
```

**Guard:** authenticated account และ ownership ป้องกัน IDOR
**Side effect:** revoke session เป้าหมาย

#### POST /api/auth/logout — ออกจากระบบ

```jsonc
// Request
{ "scope": "CURRENT_DEVICE" }
// Response 204
// Response 401: session ใช้ไม่ได้
```

**Guard:** authenticated session
**Side effect:** revoke current session หรือทุก session ตาม scope และล้าง refresh cookie

## 6. Status lifecycle

| Code | Meaning | Set by |
| --- | --- | --- |
| `loading` | ยังไม่รู้ session | frontend ก่อน bootstrap |
| `anonymous` | ไม่มี session | bootstrap 401 หรือ logout สำเร็จ |
| `unavailable` | ตรวจ session ไม่สำเร็จเพราะระบบขัดข้อง | frontend error handling |
| `authenticated` | มี session และ account | login/register/bootstrap สำเร็จ |

Transition: `loading → anonymous|unavailable|authenticated`; `anonymous|unavailable → authenticated`; `authenticated → anonymous` เมื่อ logout สำเร็จ

## 7. Data model

| Entity | Role in this flow |
| --- | --- |
| `AuthAccountDto` | ข้อมูลบัญชี roles และ permissions สำหรับแสดงผล |
| `AuthSessionListItemDto` | session แต่ละอุปกรณ์สำหรับแสดงและ revoke |
| JWE access token | credential อายุสั้น เก็บเฉพาะ memory |
| refresh token cookie | credential สำหรับต่อ session เก็บแบบ HttpOnly โดย browser |

## 8. Edge cases and errors

| Case | Handling |
| --- | --- |
| bootstrap ได้ `401` | แสดง anonymous forms โดยไม่แสดง error |
| API/network ใช้งานไม่ได้ | แสดง warning พร้อม forms และให้ submit retry ได้ |
| login credential ผิด | แสดง API detail/fallback ใน Alert โดยไม่เปิดเผยว่าบัญชีมีจริงหรือไม่ |
| register email ซ้ำ | แสดง conflict detail ที่ API ส่งมา |
| validation ผิด | แสดง field error ใต้ input และ focus field แรก |
| submit ซ้ำ | ปิด submit ระหว่าง mutation |
| list sessions ล้มเหลว | แสดง error เฉพาะส่วนพร้อมปุ่ม retry |
| revoke session ล้มเหลว | คง dialog/page state และแสดง error |
| logout ล้มเหลว | ล้าง local session และแสดง anonymous forms; ไม่คง credential ในเครื่องปัจจุบัน |
| locale เปลี่ยน | route คง `/auth` และเปลี่ยนเฉพาะ prefix `/th` หรือ `/en` |

## 9. Security and concurrency

- ห้าม persist JWE, CSRF token หรือ refresh token ใน client state ที่ JavaScript อ่านย้อนหลังได้
- request ที่ต้อง auth ใช้ generated client ซึ่งแนบ token จาก memory และทำ refresh ตาม contract เดิม
- API ตรวจ role, permission และ resource ownership ทุกครั้ง; การซ่อนปุ่มบน frontend ไม่ใช่ authorization
- revoke และ logout ปิด action ระหว่าง request เพื่อลด duplicate mutation
- ข้อความ error ต้องผ่าน `ProblemDetails` ที่ออกแบบให้เปิดเผยได้หรือ fallback เท่านั้น และไม่ log credential
- form ใช้ browser autocomplete ที่เหมาะสม: `email`, `current-password`, `new-password`, `name`

## 10. Build checklist

### `frontend-template`

- [x] ตั้ง `IBM Plex Sans Thai` เป็น font หลักของ locale `th`
- [x] เพิ่ม source-owned UI primitives ที่ auth page ใช้จริง
- [x] เพิ่ม `/[locale]/auth` พร้อม loading, anonymous, unavailable และ authenticated states
- [x] เพิ่ม login/register forms ด้วย React Hook Form
- [x] เพิ่ม account, roles, permissions, sessions, revoke และ logout UI
- [x] เพิ่มคำแปลไทย/อังกฤษและทางเข้าจากหน้าแรก
- [x] ตรวจไม่ให้มี `lucide-react` และใช้ Iconify เท่านั้น
- [x] รัน format, lint, typecheck, i18n check, Playwright และ production build

## 11. Open questions

ไม่มีคำถามที่ขวาง implementation รอบนี้; role-management CRUD, MFA, OAuth และ password reset จะเพิ่มเมื่อมี product requirement และ API contract ที่ชัดเจน
