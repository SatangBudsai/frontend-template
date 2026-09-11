# Template setup — Next.js application foundation

> คู่มือนี้อธิบายวิธีเริ่มโปรเจกต์ใหม่จาก template, เพิ่ม shadcn/ui component และตรวจคุณภาพก่อนส่งงาน อ้างอิง source จริง ณ วันที่ 10 กันยายน 2026

## 1. Actors & Systems

| Actor/System | Responsibility                                       | Ownership                                          |
| ------------ | ---------------------------------------------------- | -------------------------------------------------- |
| Developer    | ตั้งชื่อโปรเจกต์ เพิ่ม feature และเลือก dependencies | เป็นเจ้าของ application source ทั้งหมด             |
| pnpm         | ติดตั้ง dependency ตาม manifest                      | เป็นเจ้าของ `pnpm-lock.yaml`                       |
| shadcn CLI   | เพิ่ม source ของ UI component                        | เขียน `src/components/ui/**` ตาม `components.json` |
| Next.js      | Compile และ render App Router                        | เป็นเจ้าของ build output ใน `.next`                |

**Trust boundary:** ค่า secret อยู่ใน `.env.local` ของเครื่องหรือระบบ deployment เท่านั้น ไฟล์ที่ขึ้นต้นด้วย `.env` ถูก ignore ยกเว้น `.env.example`

## 2. End-to-end overview

```text
[Developer] คัดลอก template
   |
   v pnpm install
[pnpm] อ่าน package.json -> สร้าง/ตรวจ pnpm-lock.yaml
   |
   v pnpm dev
[Next.js] เปิด development server -> render GET /
   |
   v pnpm dlx shadcn@latest add <component>
[shadcn CLI] อ่าน components.json -> เขียน src/components/ui/<component>.tsx
   |
   v pnpm format:check + lint + typecheck + test + build
[Quality gate] ผ่านทุกคำสั่ง -> พร้อมเริ่ม feature หรือส่งงาน
```

**หัวใจ:** component จาก shadcn/ui เป็น source ของโปรเจกต์ จึงต้อง review และ validate เหมือน source ที่เขียนเอง

## 3. Step-by-step

### STEP 1 — Install the foundation

**System:** Developer + pnpm

- เมื่อคัดลอก template -> เปลี่ยน `name` ใน `package.json` ให้ตรงกับโปรเจกต์
- เมื่อโปรเจกต์ต้องใช้ environment variable -> คัดลอก `.env.example` เป็น `.env.local` -> ใส่ค่าจริงเฉพาะในไฟล์ local
- รัน `pnpm install` -> pnpm ต้องติดตั้งจาก manifest และสร้าง lockfile ที่สอดคล้องกัน
- เมื่อ install ล้มเหลว -> แก้ manifest, network หรือ Node version -> ห้ามลบ lockfile เพื่อซ่อนความขัดแย้งโดยไม่ตรวจสาเหตุ

### STEP 2 — Run the application

**System:** Developer + Next.js

- รัน `pnpm dev` -> Next.js เปิด development server ที่ `http://localhost:3000`
- เปิด `GET /` -> ต้องเห็นหน้า starter โดยไม่มี console หรือ compile error
- แก้ route ที่ `src/app/[locale]/page.tsx`; layout และ metadata อยู่ที่ `src/app/[locale]/layout.tsx`

### STEP 3 — Add a UI component

**System:** Developer + shadcn CLI

- รัน `pnpm dlx shadcn@latest add card` -> CLI อ่าน alias และ theme จาก `components.json`
- เมื่อ component ยังไม่มี -> CLI สร้าง source ใน `src/components/ui`
- เมื่อ component มีอยู่แล้ว -> ตรวจ diff ก่อนอนุญาต overwrite เพื่อไม่ให้ customization หาย
- import ด้วย `@/components/ui/<component>` -> อย่าสร้าง component path คู่ขนานโดยไม่มีเหตุผล
- shadcn CLI ยังไม่มี Iconify target -> component ที่ generate แล้วมี icon ต้องเปลี่ยนมาใช้ `@/components/ui/icon` และลบ icon dependency ที่ไม่ใช้

### STEP 4 — Validate the change

**System:** Developer + quality toolchain

- รัน `pnpm format:check` -> source และ config ต้องตรงกับ Prettier
- รัน `pnpm lint` -> ESLint ต้องจบด้วย exit code `0`
- รัน `pnpm typecheck` -> TypeScript ต้องจบด้วย exit code `0`
- รัน `pnpm test` -> contract tests ต้องผ่านทั้งหมด
- รัน `pnpm build` -> production build ต้อง compile route `/` สำเร็จ
- เมื่อคำสั่งใดล้มเหลว -> แก้ root cause และรันคำสั่งนั้นซ้ำก่อนส่งงาน

## 4. State lifecycle

- `package.json`: dependency intent ที่แก้โดย developer
- `pnpm-lock.yaml`: exact dependency graph ที่สร้างโดย pnpm และต้อง commit คู่กับ manifest
- `components.json`: source of truth สำหรับ style, aliases และ component generator
- `.env.local`: local secret state; ห้าม commit
- `.next`: generated build state; ลบและสร้างใหม่ได้

## 5. API specification

Baseline ไม่มี application API Route แต่มี Swagger contract ตัวอย่างที่ `src/api/example-service/example-service.swagger.json`; ใช้ `pnpm generate` สร้าง Axios client/DTO และเข้าถึงผ่าน `src/api/example-service/index.ts`

TanStack Query อยู่ที่ `src/providers/query-provider.tsx` สำหรับข้อมูลจาก server ที่ Client Component ต้อง cache, refetch, poll หรือ optimistic update ส่วน Redux Toolkit อยู่ที่ `src/store/**` และ `src/providers/redux-provider.tsx` สำหรับ global mutable client state ห้ามเก็บ remote data ชุดเดียวกันซ้ำในทั้ง Query และ Redux

Icon ทั้งโปรเจกต์เรียกผ่าน `src/components/ui/icon.tsx` โดยเก็บ Iconify IDs ที่ใช้ซ้ำไว้ใน `src/config/icons.ts`; ไม่มี `lucide-react` ใน baseline

การกำหนดภาษาอยู่ที่ `src/i18n/routing.ts` และ `src/proxy.ts` เพียงจุดกลางเดียว path ที่ไม่มี locale เช่น `/main` จะ redirect เป็น `/th/main` ครั้งแรก หลังผู้ใช้เลือกภาษา proxy จะจำด้วย `NEXT_LOCALE` cookie เป็นเวลา 1 ปีและใช้ภาษานั้นกับ unprefixed path ครั้งถัดไป ไม่ใช้ `localStorage` เพราะ server proxy อ่านไม่ได้

## 6. Status lifecycle

ไม่มี business status ลำดับ setup คือ `copied -> installed -> running -> validated` และเข้าสู่ `validated` ได้เมื่อ quality commands ผ่านทั้งหมด

## 7. Data model

ไม่มี database, schema หรือ migration ใน baseline

## 8. Edge cases & errors

| Case                         | Handling                                                                |
| ---------------------------- | ----------------------------------------------------------------------- |
| Node ต่ำกว่าเวอร์ชันที่กำหนด | ใช้ Node 22 ขึ้นไปตาม `package.json#engines` แล้วติดตั้งใหม่            |
| Lockfile ไม่ตรงกับ manifest  | รัน `pnpm install` และ review dependency diff ก่อน commit               |
| shadcn component มีอยู่แล้ว  | ใช้ CLI diff/preview หรือสำรอง customization ก่อน overwrite             |
| Environment variable หาย     | เพิ่มชื่อและตัวอย่างปลอดภัยใน `.env.example`; ใส่ค่าจริงใน `.env.local` |
| Build cache ผิดปกติ          | ลบ `.next` แล้วรัน build ใหม่; อย่าแก้ไฟล์ภายใน cache                   |

## 9. Security & concurrency

- ห้าม commit `.env.local`, token, password หรือ production credential
- review dependency และ lockfile diff ทุกครั้งที่ CLI เพิ่ม package
- อย่ารัน shadcn CLI สอง process พร้อมกัน เพราะอาจเขียน component หรือ manifest ทับกัน
- ใช้ Server Component เป็นค่าเริ่มต้นเพื่อลด client bundle และการส่งข้อมูลเกินจำเป็น

## 10. Build checklist

- [ ] ตั้งชื่อ package และ metadata ให้ตรงกับผลิตภัณฑ์
- [ ] สร้าง `.env.local` เฉพาะเมื่อจำเป็นและไม่ commit
- [ ] เพิ่ม shadcn/ui component เฉพาะที่ feature ใช้จริง
- [ ] ตรวจ source และ lockfile diff หลังเพิ่ม dependency
- [ ] รัน format, lint, typecheck, test และ build จนครบ

## 11. Open questions

ไม่มีคำถามสำหรับ baseline การเลือก authentication, database, Redux slices เฉพาะ feature และ deployment เป็นการตัดสินใจของแต่ละโปรเจกต์เมื่อมี requirement จริง
