# UI catalog

อ่าน catalog นี้ก่อนค้นหา component ภายนอก และอัปเดตเมื่อ reusable component
หรือข้อจำกัดของ component เปลี่ยน

## Project conventions

- shadcn/ui style: `base-nova`
- Primitive family: Base UI
- Styling: Tailwind CSS v4 แบบ CSS-first ที่ `src/app/globals.css`
- Icons: Iconify ผ่าน `src/components/ui/icon.tsx` และชื่อกลางจาก
  `src/config/icons.ts`
- Animation: `tw-animate-css` และ `shadcn/tailwind.css`
- Theme: semantic CSS variables ใน `src/app/globals.css`
- Install command: `pnpm ui:add <component>`

## Primitive components

Component กลุ่มนี้อยู่ใน `src/components/ui`, มี source จาก
[Official shadcn/ui](https://ui.shadcn.com/docs/components), ใช้ Base UI และ
ปรับไอคอนให้ผ่าน Iconify boundary ของโปรเจกต์แล้ว

| Component     | Local file                            | Intended usage                          | Notes                                                     |
| ------------- | ------------------------------------- | --------------------------------------- | --------------------------------------------------------- |
| Alert Dialog  | `src/components/ui/alert-dialog.tsx`  | ยืนยัน action ที่มีผลสำคัญ              | รองรับ focus management และ keyboard                      |
| Alert         | `src/components/ui/alert.tsx`         | แสดงข้อมูล คำเตือน และ error            | ใช้ semantic status copy ร่วมด้วย                         |
| Avatar        | `src/components/ui/avatar.tsx`        | รูปและ fallback ของผู้ใช้               | ต้องมีชื่อที่อ่านได้เมื่อรูปไม่โหลด                       |
| Badge         | `src/components/ui/badge.tsx`         | สถานะ role และ metadata ขนาดสั้น        | ห้ามใช้สีเป็นสัญญาณเพียงอย่างเดียว                        |
| Button        | `src/components/ui/button.tsx`        | action และ link ที่มีลักษณะเป็นปุ่ม     | เพิ่ม variant ที่นี่แทนสร้างปุ่มซ้ำใน page                |
| Card          | `src/components/ui/card.tsx`          | จัดกลุ่มเนื้อหาที่สัมพันธ์กัน           | ไม่ใช้ card ซ้อนโดยไม่มี hierarchy                        |
| Dropdown Menu | `src/components/ui/dropdown-menu.tsx` | action รองหรือ account menu             | รองรับ keyboard และ focus management                      |
| Icon          | `src/components/ui/icon.tsx`          | render ไอคอน Iconify ที่ bundle offline | ชื่อ icon ต้องมาจาก `src/config/icons.ts`                 |
| Input         | `src/components/ui/input.tsx`         | text-like form controls                 | ใช้ Label และข้อความ error ที่เชื่อมด้วย ARIA             |
| Label         | `src/components/ui/label.tsx`         | ชื่อ form control                       | ต้องชี้ไป control ผ่าน `htmlFor`/id                       |
| Select        | `src/components/ui/select.tsx`        | เลือกค่าจากรายการขนาดเล็ก               | Base UI; ห้ามแทนด้วย native select หาก pattern นี้เพียงพอ |
| Separator     | `src/components/ui/separator.tsx`     | แบ่งกลุ่มเนื้อหา                        | ใช้เพื่อโครงสร้าง ไม่ใช่ตกแต่งเกินจำเป็น                  |
| Skeleton      | `src/components/ui/skeleton.tsx`      | loading placeholder                     | ขนาดควรใกล้ final content เพื่อลด layout shift            |
| Spinner       | `src/components/ui/spinner.tsx`       | loading ขนาดเล็กใน action               | ต้องมี accessible status text เมื่อความหมายไม่ชัด         |
| Tabs          | `src/components/ui/tabs.tsx`          | สลับเนื้อหาที่อยู่ระดับเดียวกัน         | รองรับ keyboard; mobile ต้องไม่ overflow                  |

## Shared, effects and sections

ยังไม่มี reusable component ใน `src/components/shared`,
`src/components/effects` หรือ `src/components/sections` เมื่อเพิ่มครั้งแรกให้สร้าง
directory ตามหน้าที่และบันทึกรายการในไฟล์นี้

## Feature components

Auth UI อยู่ใน `src/components/auth` เพราะมี business logic เฉพาะ auth และไม่ใช่
primitive กลาง ส่วน layout ที่ใช้ร่วมกันอยู่ใน `src/components/layout`
