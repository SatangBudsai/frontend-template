# Master UI design and implementation rules

เอกสารนี้เป็นกฎกลางของ repository สำหรับการออกแบบ พัฒนา และปรับปรุง UI ให้ใช้
design system เดียวกัน ผู้พัฒนาสามารถเลือก component ที่เหมาะสมได้เองโดยไม่ต้องรอ
ให้ผู้ใช้เลือก component ย่อยทุกครั้ง

กฎนี้เป็นความรู้ของโปรเจกต์และแยกจาก Sage โดยตั้งใจ ห้ามย้ายหรือทำสำเนาไปไว้ใน
`agents/sage/` และการติดตั้งหรืออัปเดต Sage ต้องไม่เขียนทับไฟล์นี้

## เป้าหมาย

- UI สวย ทันสมัย ใช้งานง่าย และดูเป็นมืออาชีพ
- ทุกหน้าใช้ theme และ component กลางร่วมกัน
- ไม่สร้าง component ซ้ำโดยไม่จำเป็น
- ไม่ทำให้เว็บดูเหมือน generic AI/SaaS template
- รองรับ desktop, tablet และ mobile
- รักษา accessibility, performance และ maintainability

## 1. อ่านโปรเจกต์ก่อนแก้ UI

ก่อนสร้างหรือแก้ UI ทุกครั้ง ให้ตรวจสอบ:

- `components.json`
- `package.json`
- global stylesheet เช่น `src/app/globals.css`
- Tailwind configuration ซึ่งอาจเป็น CSS-first configuration ใน Tailwind CSS v4
- theme และ CSS variables
- `src/components/ui`
- `src/components/shared`
- `src/components/effects`
- `src/components/sections`
- [`docs/ui-catalog.md`](ui-catalog.md)
- component และ pattern เดิมที่ feature อื่นใช้อยู่

ต้องตรวจด้วยว่าโปรเจกต์ใช้ Base UI หรือ Radix UI, Tailwind CSS เวอร์ชันใด,
shadcn/ui style ใด, icon library ใด และ animation library ใด ห้ามผสม Base UI และ
Radix UI โดยไม่ตั้งใจ

## 2. ลำดับการเลือก component

เลือกตามลำดับนี้:

1. Component ที่มีอยู่ในโปรเจกต์
2. Component ที่บันทึกใน [`docs/ui-catalog.md`](ui-catalog.md)
3. [Official shadcn/ui](https://ui.shadcn.com)
4. [Shadcn Studio](https://shadcnstudio.com)
5. [21st.dev](https://21st.dev)
6. [Magic UI](https://magicui.design)
7. [Awesome Shadcn](https://awesomeshadcn.dev)
8. เขียน component ใหม่ เมื่อไม่มีตัวเลือกที่เหมาะสมจริง ๆ

หากผู้ใช้ระบุ URL ของ component โดยตรง ให้ตรวจ component จาก URL นั้นก่อน

## 3. บทบาทของแต่ละแหล่ง

### Official shadcn/ui

ใช้เป็นพื้นฐานของ design system สำหรับ Button, Input, Select, Dialog, Sheet,
Card, Table, Form, Dropdown, Tabs, Tooltip และ primitive พื้นฐานอื่น ๆ

### Shadcn Studio

ใช้สำหรับ component variant ที่สมบูรณ์กว่า shadcn/ui, Button Group, advanced
form controls, dashboard components, blocks, pages และ component เชิงระบบ
ก่อนใช้ต้องตรวจว่า variant เป็น Base UI หรือ Radix UI และเลือกให้ตรงกับโปรเจกต์

### 21st.dev

ใช้สำหรับ layout, hero, navigation, cards, grid, gallery, marketing sections,
creative components, interaction pattern และ UI inspiration เลือกเฉพาะสิ่งที่
เข้ากับบุคลิกของโปรเจกต์ ห้ามผสมหลายสไตล์ที่ไม่เกี่ยวข้องกัน

### Magic UI

ใช้เฉพาะเมื่อ animation หรือ effect ช่วยประสบการณ์ใช้งาน เช่น pointer, blur
fade, animated text, marquee, border/background effect และ number animation
ห้ามใช้มากเกินไป และต้องรองรับ `prefers-reduced-motion`

### Awesome Shadcn

เป็น directory สำหรับค้นหาแหล่งเพิ่มเติม ไม่ใช่ component library หลัก ใช้เมื่อ
แหล่งหลักไม่มีสิ่งที่ต้องการ, ต้องใช้ component เฉพาะทาง, ต้องการดีไซน์ที่โดดเด่น
ขึ้น หรือมี interaction ขั้นสูง ไม่ต้องค้นทุกเว็บไซต์ทุกครั้ง และเพิ่มแหล่ง UI
ใหม่ได้ไม่เกินหนึ่งแหล่งต่องาน เว้นแต่มีเหตุผลทางเทคนิคที่ชัดเจน

## 4. ตรวจสอบแหล่งภายนอก

ก่อนติดตั้ง component, registry หรือ package ใหม่ ต้องตรวจ:

- React, Next.js และ Tailwind CSS compatibility
- Base UI หรือ Radix UI
- responsive behavior
- keyboard navigation, focus management, ARIA และ accessibility
- dark mode และ light mode
- dependencies และ bundle-size impact
- maintenance activity
- license และสิทธิ์ใช้งานเชิงพาณิชย์
- script หรือ package ที่น่าสงสัย
- dependency ซ้ำกับของเดิม

ห้ามติดตั้ง premium component หากยังไม่มี license ที่ถูกต้อง และห้ามเปิดเผยหรือ
commit API key, license key, email ยืนยัน license, credential หรือ environment
variables

## 5. ใช้ component กลางทั้ง repository

Component พื้นฐานต้องแก้ที่ส่วนกลาง เช่น `components/ui/button.tsx`,
`input.tsx`, `card.tsx`, `dialog.tsx` และ `badge.tsx` ห้ามสร้าง primitive ใหม่
ภายในแต่ละ page หากเพิ่ม variant ให้ component กลางได้

เมื่อนำ Button หรือ Input จากแหล่งอื่นมาใช้ ให้เปรียบเทียบกับ component กลางและ
merge เฉพาะ variant, size, state, styling หรือ accessibility behavior ที่ต้องการ
ต้องรักษา backward compatibility ของ props, variants, sizes, existing imports
และ existing behavior

ก่อนเปลี่ยน component กลาง ให้ค้นหาทุกจุดที่เรียกใช้ทั่ว repository และประเมิน
ผลกระทบก่อนเสมอ

## 6. ห้าม overwrite โดยไม่ตรวจสอบ

ห้ามใช้ CLI `--overwrite` กับ component กลางทันที ก่อนแทนที่ component ต้อง:

1. อ่าน component เดิม
2. อ่าน source จาก registry
3. เปรียบเทียบ diff
4. ตรวจ props และ variants เดิม
5. merge อย่างระมัดระวัง
6. ตรวจทุกจุดที่เรียกใช้
7. รัน typecheck, lint และ build
8. ตรวจหน้าเดิมที่ได้รับผลกระทบ

ห้ามแก้ไฟล์ใน `node_modules`

## 7. โครงสร้าง component

- `src/components/ui` — primitive และ component พื้นฐาน
- `src/components/shared` — component ประกอบที่ใช้ซ้ำ เช่น ButtonGroup,
  SearchBox และ DataTable
- `src/components/effects` — effect เช่น Pointer, BlurFade และ Marquee
- `src/components/sections` — section ที่ใช้ซ้ำ เช่น Hero, News, Contact และ CTA
- `src/features/[feature-name]` — component ที่มี business logic เฉพาะ feature

อย่านำ component เฉพาะ feature ไปไว้ใน `components/ui`

## 8. Design tokens เป็น source of truth

ค่าที่ใช้ซ้ำต้องมาจาก theme และ semantic design tokens เช่น `background`,
`foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`,
`ring`, `radius` และ `shadow`

หลีกเลี่ยง hardcode ซ้ำ เช่น `bg-purple-600`, `text-gray-700`, `rounded-[13px]`
และ `shadow-[custom-value]` ให้ใช้ semantic token เช่น `bg-primary`,
`text-foreground`, `text-muted-foreground`, `border-border`, `rounded-lg` และ
`shadow-sm`

Component ภายนอกต้องปรับให้ใช้สี, typography, spacing, radius, shadow, motion
duration และ easing ของโปรเจกต์ External component ให้โครงสร้างและพฤติกรรม
แต่ห้ามนำ theme แยกเข้ามาทำให้ design system แตกเป็นหลายชุด

## 9. Animation และ effect

Animation ต้องช่วย visual hierarchy, user feedback, state transition, content
discovery หรือ perceived responsiveness หลีกเลี่ยง animation ที่รบกวนการอ่าน,
effect ซ้ำ, layout shift และ animation หนักบนมือถือ โดยทั่วไปใช้ prominent
animation ไม่เกินหนึ่ง effect ต่อ section

Pointer หรือ mouse effect ต้องเปิดเฉพาะ fine pointer, ปิดบน mobile/touch,
รองรับ `prefers-reduced-motion`, ไม่ขัดขวาง click/hover/focus และไม่ลดความชัดเจน
ของ native cursor โดยไม่จำเป็น

## 10. Responsive และ accessibility

ทุก component ต้องตรวจ desktop, tablet, mobile, keyboard navigation,
focus-visible, hover, active, disabled, loading, empty และ error state

Interactive target บน mobile ควรมีขนาดประมาณ 44px เมื่อทำได้ Button Group หรือ
Toolbar ที่พื้นที่ไม่พอให้เลือก horizontal scrolling, wrapping, compact variant
หรือ dropdown overflow ตามบริบท ห้ามบีบข้อความจนอ่านยาก และสีข้อความกับพื้นหลัง
ต้องมี contrast เพียงพอ

## 11. การเลือก component โดยอัตโนมัติ

เลือก component ได้เองโดยไม่ต้องถาม หากไม่เปลี่ยน business logic, ไม่ต้องซื้อ
license, ไม่เพิ่ม dependency ขนาดใหญ่, ไม่เปลี่ยน design direction หลัก และไม่
กระทบ component กลางอย่างรุนแรง

ต้องถามเมื่อจำเป็นต้องซื้อ premium license, ตัวเลือกเปลี่ยนทิศทางดีไซน์อย่างมี
นัยสำคัญ, เพิ่ม dependency ขนาดใหญ่, เปลี่ยน Base UI กับ Radix UI, เปลี่ยน public
API ของ component กลาง หรืออาจทำให้หลายหน้าเปลี่ยนพฤติกรรม

## 12. UI catalog

เมื่อเพิ่ม reusable component ให้อัปเดต [`docs/ui-catalog.md`](ui-catalog.md)
โดยบันทึก:

- component name และ local file path
- source และ source URL
- Base UI หรือ Radix UI
- dependencies
- intended usage และ restrictions
- mobile behavior
- accessibility notes

ในงานถัดไปต้องอ่าน catalog ก่อนค้นหา component ภายนอก

## 13. ขั้นตอนการทำงาน

1. อ่าน requirement
2. ตรวจ design system และ component เดิม
3. ตรวจ UI catalog
4. ระบุประเภท component ที่ต้องใช้
5. ค้นหาจากแหล่งหลักตามลำดับ
6. เลือก component ที่เหมาะที่สุด
7. ตรวจ compatibility, license และ dependencies
8. ติดตั้งผ่าน registry หรือ CLI หากมี
9. ตรวจ diff ก่อนเปลี่ยน component กลาง
10. ปรับ component ให้เข้ากับ design system
11. เชื่อม business logic จริง
12. ตรวจ responsive และ accessibility
13. รัน typecheck, lint, test และ build
14. ตรวจหน้าเว็บจริงด้วย browser หรือ screenshot
15. อัปเดต UI catalog
16. สรุปผล

## 14. การตรวจสอบก่อนส่งงาน

ต้องตรวจอย่างน้อย:

- ไม่มี TypeScript, lint, console หรือ broken-import error
- ไม่มี component ซ้ำโดยไม่จำเป็น
- ไม่มี hardcoded theme ที่ควรเป็น token
- ไม่มี layout overflow
- build สำเร็จ
- desktop และ mobile ใช้งานได้
- keyboard ใช้งานได้
- loading, empty และ error state เหมาะสม
- หน้าเดิมไม่เสียจากการแก้ component กลาง
- หากมี test หรือ E2E test ให้รัน test ที่เกี่ยวข้อง

## 15. รูปแบบรายงาน

สรุปอย่างกระชับโดยระบุสิ่งที่เปลี่ยน, component กลาง/ใหม่, source URL,
primitive family, dependency ที่เพิ่มหรือลบ, ผลกระทบต่อหน้าอื่น, ผล typecheck,
lint, test และ build, ผลตรวจ desktop/mobile และข้อจำกัดที่ยังต้องระวัง

## คำสั่งเริ่มต้น

พัฒนา UI ตาม requirement โดยเลือก component ตามลำดับ:

Existing Components → UI Catalog → shadcn/ui → Shadcn Studio → 21st.dev →
Magic UI → Awesome Shadcn → Custom Code

ใช้ component กลางและ design tokens เป็น source of truth ห้ามสร้าง primitive ซ้ำ
ในแต่ละหน้า ห้ามเขียนเลียนแบบ component จากความจำ และห้าม overwrite component
กลางโดยไม่ตรวจ diff และผลกระทบ หลังพัฒนาให้ตรวจ repository เท่าที่ได้รับผลกระทบ
รันการตรวจที่เกี่ยวข้อง และรายงาน source URL ของ component ที่นำมาใช้
