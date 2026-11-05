import type { Metadata } from "next";
import "./globals.css";
import { LiffProvider } from "@/components/LiffProvider";

export const metadata: Metadata = {
  title: "RepairCom | ระบบแจ้งซ่อมคอมพิวเตอร์และไอทีโรงเรียนผ่าน LINE OA",
  description:
    "ระบบแจ้งซ่อมห้องปฏิบัติการคอมพิวเตอร์และอุปกรณ์ไอทีภายในโรงเรียน เชื่อมต่อกับ LINE Official Account และ LINE LIFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <LiffProvider>{children}</LiffProvider>
      </body>
    </html>
  );
}

