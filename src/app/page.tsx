import Link from "next/link";
import {
  Monitor,
  Wrench,
  ClipboardList,
  ShieldCheck,
  MessageSquare,
  Bell,
  ArrowRight,
  School,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-line flex items-center justify-center shadow-lg shadow-line/30">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">
                RepairCom School
              </h1>
              <p className="text-xs text-slate-400">
                ระบบแจ้งซ่อมคอมพิวเตอร์และไอทีโรงเรียนผ่าน LINE OA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/liff/repair"
              className="px-3.5 py-2 rounded-lg bg-line hover:bg-line-dark text-white text-xs sm:text-sm font-medium transition flex items-center gap-1.5"
            >
              <Wrench className="w-4 h-4" />
              <span>หน้าแจ้งซ่อม (LIFF)</span>
            </Link>
            <Link
              href="/admin"
              className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium transition flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>สำหรับช่าง / แอดมิน</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-4">
            <School className="w-4 h-4" />
            <span>สำหรับห้องปฏิบัติการคอมพิวเตอร์ ครู และบุคลากรในโรงเรียน</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            แจ้งซ่อมคอมพิวเตอร์และอุปกรณ์ไอที{" "}
            <span className="text-line">ผ่าน LINE Official Account</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            สะดวกทั้งครูผู้สอนและทีมช่างเทคนิคของโรงเรียน แจ้งปัญหาคอมพิวเตอร์ห้องเรียน
            โปรเจคเตอร์ ปริ้นเตอร์ หรืออินเทอร์เน็ต พร้อมแนบรูปถ่ายและรับแจ้งเตือนสถานะงานซ่อมแบบ
            Flex Message ในแชท LINE ทันที
          </p>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: LIFF Repair Form */}
          <Link
            href="/liff/repair"
            className="group relative rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-line/60 p-6 transition-all flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-line/20 border border-line/40 text-line flex items-center justify-center mb-4">
                <Wrench className="w-6 h-6" />
              </div>
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                LINE LIFF App (ฝั่งผู้แจ้ง)
              </span>
              <h3 className="text-xl font-bold mb-2 group-hover:text-line transition">
                1. ฟอร์มแจ้งซ่อมผ่าน LINE
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                หน้าเว็บสำหรับเปิดใน LINE LIFF ให้ครู บุคลากร หรือนักเรียน
                เลือกห้องเรียนคอมพิวเตอร์ ระบุหมายเลขเครื่อง (เช่น PC-01) ความเร่งด่วน
                และแนบรูปอาการเสีย
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-sm font-medium text-line">
              <span>เปิดหน้าแจ้งซ่อม</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: LIFF My Repairs */}
          <Link
            href="/liff/my-repairs"
            className="group relative rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/60 p-6 transition-all flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mb-4">
                <ClipboardList className="w-6 h-6" />
              </div>
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
                LINE LIFF App (ฝั่งผู้แจ้ง)
              </span>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition">
                2. ติดตามสถานะงานซ่อม
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                ตรวจสอบรายการแจ้งซ่อมของตัวเอง ดูว่าช่างรับเรื่องหรือยัง
                ใครเป็นช่างผู้รับผิดชอบ และดูบันทึกผลการซ่อมย้อนหลังได้ตลอดเวลา
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-sm font-medium text-blue-400">
              <span>ดูสถานะงานซ่อมของฉัน</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Admin / Technician Dashboard */}
          <Link
            href="/admin"
            className="group relative rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/60 p-6 transition-all flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
                Web Dashboard (ฝั่งช่าง/แอดมิน)
              </span>
              <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition">
                3. ระบบจัดการงานซ่อม (Admin)
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                แดชบอร์ดสำหรับครูคอมพิวเตอร์หรือช่างเทคนิค ดูสรุปยอดงานซ่อม กรองตามห้องเรียน
                อัปเดตสถานะ ใส่หมายเหตุการซ่อม และส่งแจ้งเตือนเข้า LINE ผู้แจ้งอัตโนมัติ
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-sm font-medium text-amber-400">
              <span>เข้าสู่หน้าแอดมิน</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Info Banner about LINE OA Integration */}
        <div className="mt-10 rounded-2xl bg-slate-800/80 border border-white/10 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-line font-semibold">
              <MessageSquare className="w-5 h-5" />
              <span>รองรับการทดสอบทันที (Mock LIFF Mode) & เชื่อมต่อ LINE OA จริง</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              คุณสามารถกดทดสอบทั้งฝั่ง <strong>ผู้แจ้งซ่อม (LIFF)</strong> และฝั่ง{" "}
              <strong>ช่างซ่อม (Admin Dashboard)</strong> บนเบราว์เซอร์ได้ทันที!
              เมื่อต้องการเชื่อมต่อกับ LINE OA จริง เพียงนำ{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-900 text-emerald-300">
                LINE_CHANNEL_ACCESS_TOKEN
              </code>
              ,{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-900 text-emerald-300">
                LINE_CHANNEL_SECRET
              </code>{" "}
              และ{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-900 text-emerald-300">
                NEXT_PUBLIC_LIFF_ID
              </code>{" "}
              มาใส่ในไฟล์ <code className="text-amber-300">.env</code>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
            <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-3 rounded-xl border border-white/10">
              <Bell className="w-5 h-5 text-line shrink-0" />
              <div className="text-xs">
                <div className="font-semibold text-white">Webhook Endpoint</div>
                <div className="text-slate-400 font-mono">
                  POST /api/line/webhook
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

