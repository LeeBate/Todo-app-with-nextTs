# Next.js Todo App with Drag & Drop

# Deploy
vercel: https://todo-app-with-next-ts.vercel.app/

## การติดตั้งและรันโปรเจค
### ความต้องการของระบบ
- Node.js 18+ 
- npm หรือ yarn
- Git

### ขั้นตอนการติดตั้ง

1. **Clone repository**
```bash
git clone https://github.com/LeeBate/Todo-app-with-nextTs.git
cd Todo-app-with-nextTs
```

2. **เพิ่ม File .env ที่ด้านนอกสุดของโปรเจค**
```bash
API_BASE_URL = "https://jsonplaceholder.typicode.com/todos"
```

3. **ติดตั้ง dependencies**
```bash
npm install
# หรือ
yarn install
```

4. **รันโครงการในโหมด development**
```bash
npm run dev
# หรือ
yarn dev
```

5. **เปิดเบราว์เซอร์**
```
http://localhost:3000
```

## เหตุผลในการเลือกใช้เทคโนโลยี

### Next.js + App Router
**เหตุผล:**
- เป็นเฟรมเวิร์ก React ที่ใช้ประโยชน์จากสถาปัตยกรรมของ React อย่างเต็มที่เพื่อเปิดใช้งานแอป React แบบฟูลสแต็ก
- **Full-stack Framework**: สามารถสร้างทั้ง frontend และ backend API
- **Developer Experience**: Hot reload, TypeScript support, excellent tooling

**ทางเลือกอื่น:** Create React App, Vite + React
**เหตุผลที่ไม่เลือก:** ไม่มี built-in API routes, ต้องตั้งค่าเพิ่มเติมมาก

### Tailwind CSS
**เหตุผล:**
- **Utility-first**: เขียน CSS ได้เร็วและยืดหยุ่น
- **Responsive Design**: Built-in responsive utilities

## ฟีเจอร์ Drag & Drop

### Technical Implementation
```typescript
// Drag Events
onDragStart  // เริ่มลาก - set drag data
onDragEnd    // จบการลาก - cleanup
onDragOver   // ลากผ่าน - prevent default
onDragLeave  // ออกจาก drop zone - clear highlight
onDrop       // วาง - handle drop logic
```

### State Management
```typescript
interface DragDropState {
  draggedItem: number | null      // ID ของ item ที่กำลังลาก
  dropZone: string | null         // Zone ที่กำลัง hover
  recentlyDroppedItem: number | null // Item ที่เพิ่งถูกวาง
  indicatorType: 'new' | 'completed' | null // ประเภทของ badge
}
```

### Badge System Logic
```typescript
// แสดง badge เมื่อ:
1. เพิ่ม Todo ใหม่ → "ใหม่!" (30 วินาที)
2. ลาก pending → completed → "เสร็จแล้ว!" (30 วินาที)

// ซ่อน badge เมื่อ:
1. ครบ 30 วินาที (auto-hide)
2. ลาก completed → pending (ทันที)
3. คลิก checkbox เพื่อยกเลิก (ทันที)
```

## API Design

### RESTful API Structure
```typescript
GET    /api/todos       // ดึงรายการ todos (limit 10)
POST   /api/todos       // สร้าง todo ใหม่
GET    /api/todos/[id]  // ดึง todo ตาม ID
PATCH  /api/todos/[id]  // อัพเดท todo
DELETE /api/todos/[id]  // ลบ todo
```

### External API Integration
- **JSONPlaceholder**: `https://jsonplaceholder.typicode.com/todos`
- **Error Fallback**: จัดการเมื่อ external API ไม่พร้อมใช้งาน

## State Management

### Local State Strategy
```typescript
// Main App State
const [todos, setTodos] = useState<Todo[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
const [actionLoading, setActionLoading] = useState(false)
```

### Context API Usage
```typescript
// Drag & Drop Context
const DragDropContext = createContext<{
  draggedItem: number | null
  dropZone: string | null
  recentlyDroppedItem: number | null
  indicatorType: 'new' | 'completed' | null
  // ... setter functions
}>()
```
