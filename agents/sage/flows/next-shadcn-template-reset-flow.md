# Next.js + shadcn/ui Template Reset Flow

> เอกสารนี้กำหนดการเปลี่ยนโปรเจกต์ CMU Research Gallery ให้เป็น template ขั้นต่ำสำหรับเริ่มงาน Next.js ใหม่ อ้างอิง source และ configuration จริง ณ วันที่ 10 กันยายน 2026 โดยเก็บ recovery archive ไว้นอก repository ก่อนลบไฟล์เดิม

## 1. Design decisions

- ใช้ Next.js App Router, React, TypeScript และ Tailwind CSS เป็นแกนหลัก
- ใช้ shadcn/ui แบบ source-owned components ผ่าน `components.json` แทน runtime UI library
- เริ่มด้วย `Button` เพียง component เดียว เพื่อพิสูจน์ installation path โดยไม่เพิ่ม dependency ที่ template ยังไม่ใช้
- เก็บ tooling ทั่วไปของ repository แต่ลบ source, assets, tests, docs และ Sage knowledge ที่ผูกกับ CMU/HeroUI
- เก็บ backup ที่ `C:\Me\PersonalCoding\Template\frontend-template-backup-20260910-complete.zip`; ไม่รวม `.next` และ log/cache ที่สร้างใหม่ได้

## 2. Actors & systems

| Actor/System | Responsibility | Ownership |
| --- | --- | --- |
| Developer | คัดลอก template และเพิ่ม feature | เป็นเจ้าของ source ที่เกิดหลังเริ่มโปรเจกต์ใหม่ |
| Next.js app | Render หน้าเริ่มต้นและจัดการ route | เป็นเจ้าของ `src/app/**` |
| shadcn CLI | สร้าง configuration และ component source | เขียนผ่าน `components.json` ไปยัง `src/components/ui/**` |
| pnpm | จัดการ dependencies และ lockfile | เป็นเจ้าของ `pnpm-lock.yaml` |
| Recovery archive | เก็บ snapshot ก่อน reset | อยู่นอก repository และอาจมี local environment values |

**Trust boundary:** template ใหม่ต้องไม่มี secret หรือค่า environment จริง ส่วน ZIP backup ไม่ต้องถูก commit หรือแชร์ เพราะมี `.env` เดิมอยู่ภายใน

## 3. End-to-end overview

```text
[Developer] ยืนยัน Full template reset
   |
   v
[Workspace] ตรวจ absolute paths และ source inventory
   |
   v
[Recovery] สร้าง ZIP นอก repository -> ตรวจจำนวน entry และอ่านทุก entry
   |
   v
[Workspace] ลบ CMU/HeroUI source, generated output, local env และ project knowledge
   |
   v
[pnpm + shadcn CLI] ติดตั้ง dependency -> สร้าง components.json + Button source
   |
   v
[Next.js app] สร้าง layout, page และ global theme baseline
   |
   v
[Validation] residue scan -> format -> lint -> typecheck -> unit test -> production build
   |
   v
[Developer] ได้ reusable template ที่ไม่มี HeroUI และไม่มี domain content เดิม
```

**Key:** recovery archive ต้องผ่าน integrity check ก่อนเริ่มลบ และ `pnpm-lock.yaml` ต้องสร้างจาก dependency set ใหม่เท่านั้น

## 4. Step-by-step

### STEP 1 — Preserve the recoverable state

**System:** Workspace + Recovery archive

- เมื่อ resolved source path ตรงกับ repository ที่อนุมัติ -> สร้าง ZIP นอก repository
- เมื่อ source เป็น cache/log ที่สร้างใหม่ได้ -> ไม่รวมใน ZIP
- เมื่อ ZIP สร้างเสร็จ -> เปิดและอ่านทุก entry -> จำนวน entry ต้องตรงกับ recoverable source files
- เมื่อ integrity check ไม่ผ่าน -> หยุดก่อนลบ source

### STEP 2 — Remove project-specific state

**System:** Workspace

- เมื่อ backup ผ่าน -> ลบ app source, public assets, project tests/docs/scripts และ generated caches
- เมื่อไฟล์เป็น Sage protocol/commands/roles ทั่วไป -> เก็บไว้
- เมื่อ Sage knowledge อ้าง CMU/HeroUI -> ลบ และสร้าง index/flow ใหม่ที่ตรงกับ template
- เมื่อพบ `.env` หรือ `.env.dev` -> ลบโดยไม่แสดงค่า; เก็บ `.env.example` แบบว่างและมีคำอธิบาย

### STEP 3 — Establish the new dependency boundary

**System:** pnpm + shadcn CLI

- เมื่อ `package.json` ถูกลดเหลือ baseline -> ติดตั้งด้วย pnpm -> lockfile ต้องไม่มี `@heroui/*`
- เมื่อ Tailwind และ alias พร้อม -> รัน `shadcn init` แบบ non-interactive ตาม CLI version ปัจจุบัน
- เมื่อ init สำเร็จ -> เพิ่ม `button` -> source ต้องอยู่ที่ `src/components/ui/button.tsx`

### STEP 4 — Build the reusable starter

**System:** Next.js app

- เมื่อ component foundation พร้อม -> สร้าง Server Component page ที่ import `Button` โดยตรง
- เมื่อ render หน้า `/` -> แสดงชื่อ template, stack summary และ next-step ที่ไม่ผูกกับโดเมนธุรกิจ
- เมื่อผู้ใช้ใช้ keyboard -> focus state ของ action ต้องมองเห็นได้
- เมื่อ viewport แคบ -> content ต้อง reflow โดยไม่มี horizontal overflow

### STEP 5 — Validate and hand off

**System:** Validation toolchain

- เมื่อ source ใหม่เสร็จ -> scan `HeroUI`, `NextUI`, `CMU Research` และ package residue
- เมื่อ scan สะอาด -> รัน formatter, ESLint, TypeScript, unit tests และ production build
- เมื่อ critical check ล้มเหลว -> แก้และรันซ้ำ; ห้ามสรุปว่า template พร้อมใช้

## 5. State and data handling

Template ไม่มี application state, database หรือ client-side store เริ่มต้น มีเพียง static Server Component UI และ build configuration ส่วน local environment state มี lifecycle ดังนี้:

- `.env`/`.env.dev` เดิม: อยู่เฉพาะใน recovery ZIP หลัง reset
- `.env.example`: อยู่ใน repository โดยไม่มี secret
- `components.json`: อยู่ใน repositoryและเป็น configuration source สำหรับ shadcn CLI
- `.next`: generated cache; ไม่ใช่ source of truth และลบได้

## 6. API specification

ไม่มี API endpoint ที่ reuse หรือสร้างใหม่ใน baseline นี้ Route `/` เป็น Server Component แบบ static และไม่มี side effect

## 7. Status lifecycle

ไม่มี business status หรือ persisted workflow state สถานะงานมีเพียง `backed-up -> cleaned -> initialized -> validated`; การเข้าสู่ `cleaned` ทำได้หลัง `backed-up` ผ่าน integrity check เท่านั้น

## 8. Data model touchpoints

ไม่มี database, schema, migration หรือ generated API client ใน template ใหม่

## 9. Edge cases & error handling

| Case | Handling |
| --- | --- |
| Backup path มีไฟล์อยู่แล้ว | ใช้ชื่อใหม่โดยไม่ overwrite archive ที่อาจมีข้อมูล |
| `.next` มีขนาดใหญ่มาก | ไม่รวมเพราะสร้างใหม่ได้ และบันทึกข้อยกเว้นไว้ชัดเจน |
| shadcn CLI เปลี่ยน flag | อ่าน `init --help` ของ version ที่รันจริงก่อนใช้ non-interactive flags |
| Dependency install ล้มเหลว | เก็บ `package.json`, แก้สาเหตุ และรัน install ซ้ำก่อนสร้าง component |
| HeroUI residue ยังอยู่ | ลบ import/config/script/knowledge ที่เหลือและ scan ซ้ำ |
| Build สร้าง `next-env.d.ts` ใหม่ | ยอมรับเป็น generated framework file; ไม่ถือเป็น domain residue |

## 10. Security & concurrency

- ไม่อ่านหรือพิมพ์ค่าใน `.env`; backup archive อยู่นอก repository และต้องไม่ commit/share
- ไม่มี external API, auth, payment, PII processing หรือ concurrent mutation ใน baseline
- การ clean เป็น single-writer operation; ห้ามรัน dev/build พร้อมกันระหว่างลบ `.next` และติดตั้ง dependency
- ทุก recursive deletion ต้อง resolve อยู่ใต้ `C:\Me\PersonalCoding\Template\frontend-template`

## 11. Build checklist

- [x] `TPL-01` Recovery — depends on: none — เมื่อสร้าง ZIP แล้ว จำนวน entry และการอ่านทุก entry ต้องผ่านก่อน deletion
- [x] `TPL-02` Cleanup — depends on: `TPL-01` — เมื่อ reset แล้วต้องไม่เหลือ source/docs/assets เฉพาะ CMU และ local `.env`
- [x] `TPL-03` Dependencies — depends on: `TPL-02` — เมื่อ install แล้ว lockfile ต้องมี shadcn dependencies และไม่มี `@heroui/*`
- [x] `TPL-04` Starter UI — depends on: `TPL-03` — เมื่อเปิด `/` ต้อง render baseline responsive page ที่ใช้ shadcn `Button`
- [x] `TPL-05` Validation — depends on: `TPL-04` — formatter, lint, typecheck, tests และ build ต้องผ่านทั้งหมด
- [x] `TPL-06` Documentation — depends on: `TPL-05` — README และ setup guide ต้องอธิบายคำสั่งใช้งานจริงของ template

## 12. Out of scope

- Authentication, database, API client, state management และ domain-specific examples
- การเก็บ compatibility layer ของ HeroUI หรือ migration adapter สำหรับ component เดิม
- การนำ assets, content, routes หรือ design tokens ของ CMU กลับมาใช้
- การ publish/deploy template ไปยัง hosting provider

## 13. Open questions

ไม่มีคำถามที่ block implementation การเลือก shadcn style/base color เป็น internal reversible default และจะใช้ค่ามาตรฐานของ CLI version ที่ติดตั้งจริง

**Verification verdict:** `design-clear` — flow มี recovery gate, exact ownership, failure paths, dependency control และ validation evidence ครบสำหรับ single-session implementation
