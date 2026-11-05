export const SCHOOL_ROOMS = [
  "ห้องปฏิบัติการคอมพิวเตอร์ 1 (อาคาร 2 ชั้น 3)",
  "ห้องปฏิบัติการคอมพิวเตอร์ 2 (อาคาร 2 ชั้น 3)",
  "ห้องปฏิบัติการคอมพิวเตอร์ 3 / ห้อง AI (อาคาร 2 ชั้น 4)",
  "ห้องพักครูกลุ่มสาระฯ วิทยาศาสตร์และเทคโนโลยี",
  "ห้องพักครูกลุ่มสาระฯ คณิตศาสตร์",
  "ห้องพักครูกลุ่มสาระฯ ภาษาไทย / สังคม",
  "ห้องพักครูกลุ่มสาระฯ ภาษาต่างประเทศ",
  "ห้องธุรการ / การเงิน (อาคาร 1 ชั้น 1)",
  "ห้องวิชาการ / ทะเบียนวัดผล",
  "ห้องผู้อำนวยการ / รองผู้อำนวยการ",
  "ห้องสมุดโรงเรียน",
  "ห้องโสตทัศนศึกษา / หอประชุม",
  "อื่นๆ (ระบุในรายละเอียด)",
];

export const DEVICE_TYPES: Record<string, { label: string; icon: string }> = {
  PC: { label: "คอมพิวเตอร์ตั้งโต๊ะ (PC)", icon: "Monitor" },
  NOTEBOOK: { label: "โน้ตบุ๊ก (Notebook)", icon: "Laptop" },
  PROJECTOR: { label: "โปรเจคเตอร์ / จอภาพ / TV", icon: "Projector" },
  PRINTER: { label: "เครื่องพิมพ์ (Printer / Scanner)", icon: "Printer" },
  NETWORK: { label: "อินเทอร์เน็ต / Wi-Fi / สาย LAN", icon: "Wifi" },
  PERIPHERAL: { label: "เมาส์ / คีย์บอร์ด / ลำโพง / UPS", icon: "Mouse" },
  SOFTWARE: { label: "โปรแกรม / Windows / ไวรัส", icon: "Cpu" },
  OTHER: { label: "อุปกรณ์ไอทีอื่นๆ", icon: "Wrench" },
};

export const REPORTER_ROLES: Record<string, string> = {
  TEACHER: "ครู / อาจารย์",
  STAFF: "บุคลากร / เจ้าหน้าที่สำนักงาน",
  STUDENT: "นักเรียน",
};

export const URGENCY_LEVELS: Record<
  string,
  { label: string; badgeClass: string; colorHex: string }
> = {
  NORMAL: {
    label: "ปกติ (ใช้งานเครื่องอื่นทดแทนได้)",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
    colorHex: "#64748B",
  },
  URGENT: {
    label: "ด่วน (ต้องใช้สอน / ทำงานในวันนี้)",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
    colorHex: "#D97706",
  },
  CRITICAL: {
    label: "ด่วนมาก (กำลังทำการเรียนการสอน / สอบ)",
    badgeClass: "bg-rose-100 text-rose-800 border-rose-300",
    colorHex: "#E11D48",
  },
};

export const REPAIR_STATUSES: Record<
  string,
  {
    label: string;
    badgeClass: string;
    colorHex: string;
    bgHex: string;
    description: string;
  }
> = {
  PENDING: {
    label: "รอรับเรื่อง",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
    colorHex: "#D97706",
    bgHex: "#FEF3C7",
    description: "แจ้งซ่อมแล้ว รอช่างเทคนิคตรวจสอบ",
  },
  IN_PROGRESS: {
    label: "กำลังดำเนินการซ่อม",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-300",
    colorHex: "#2563EB",
    bgHex: "#DBEAFE",
    description: "ช่างรับเรื่องและกำลังดำเนินการแก้ไข",
  },
  WAITING_PARTS: {
    label: "รออะไหล่ / ส่งเคลม",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-300",
    colorHex: "#7C3AED",
    bgHex: "#EDE9FE",
    description: "อยู่ระหว่างเบิกอะไหล่หรือส่งซ่อมศูนย์",
  },
  COMPLETED: {
    label: "ซ่อมเสร็จสิ้น",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
    colorHex: "#059669",
    bgHex: "#D1FAE5",
    description: "ดำเนินการแก้ไขเรียบร้อย พร้อมใช้งาน",
  },
  CANCELLED: {
    label: "ยกเลิกรายการ",
    badgeClass: "bg-slate-200 text-slate-600 border-slate-300",
    colorHex: "#64748B",
    bgHex: "#F1F5F9",
    description: "รายการแจ้งซ่อมถูกยกเลิก",
  },
};

