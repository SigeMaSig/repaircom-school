"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLiff } from "@/components/LiffProvider";
import {
  SCHOOL_ROOMS,
  DEVICE_TYPES,
  REPORTER_ROLES,
  URGENCY_LEVELS,
} from "@/lib/constants";
import {
  Wrench,
  ClipboardList,
  CheckCircle2,
  Upload,
  AlertCircle,
  UserCheck,
  Home,
  Sparkles,
  Loader2,
  X,
} from "lucide-react";

export default function LiffRepairPage() {
  const { profile, isMockMode, isReady, switchMockUser } = useLiff();

  const [reporterName, setReporterName] = useState("");
  const [reporterRole, setReporterRole] = useState("TEACHER");
  const [phone, setPhone] = useState("");
  const [room, setRoom] = useState(SCHOOL_ROOMS[0]);
  const [assetCode, setAssetCode] = useState("");
  const [deviceType, setDeviceType] = useState("PC");
  const [urgency, setUrgency] = useState("NORMAL");
  const [problemTitle, setProblemTitle] = useState("");
  const [problemDetail, setProblemDetail] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<{
    ticketCode: string;
    problemTitle: string;
    room: string;
    lineSent: boolean;
    lineReason?: string;
  } | null>(null);

  useEffect(() => {
    if (isReady && profile.displayName && !reporterName) {
      setReporterName(profile.displayName);
    }
  }, [isReady, profile.displayName, reporterName]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "อัปโหลดรูปไม่สำเร็จ");
      }
      setImageUrl(data.url);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ"
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/repairs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineUserId: profile.userId,
          lineDisplayName: profile.displayName,
          linePictureUrl: profile.pictureUrl,
          reporterName,
          reporterRole,
          phone,
          room,
          assetCode,
          deviceType,
          urgency,
          problemTitle,
          problemDetail,
          imageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "ไม่สามารถส่งใบแจ้งซ่อมได้");
      }

      setSubmittedTicket({
        ticketCode: data.ticket.ticketCode,
        problemTitle: data.ticket.problemTitle,
        room: data.ticket.room,
        lineSent: data.lineNotification?.sent ?? false,
        lineReason: data.lineNotification?.reason,
      });
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการส่งข้อมูล"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedTicket(null);
    setAssetCode("");
    setProblemTitle("");
    setProblemDetail("");
    setImageUrl(null);
    setUrgency("NORMAL");
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      {/* Top LIFF Header */}
      <div className="bg-line text-white shadow-md sticky top-0 z-20">
        <div className="max-w-lg mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">
                แจ้งซ่อมคอมพิวเตอร์ & ไอที
              </h1>
              <p className="text-xs text-white/90">
                ระบบแจ้งซ่อมออนไลน์ผ่าน LINE OA โรงเรียน
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Link
              href="/liff/my-repairs"
              className="px-2.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-medium flex items-center gap-1 transition"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>งานซ่อมของฉัน</span>
            </Link>
            <Link
              href="/"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              title="กลับหน้าหลัก"
            >
              <Home className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* LINE Profile Card & Mock Switcher */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center overflow-hidden border border-emerald-200">
                {profile.pictureUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.pictureUrl}
                    alt={profile.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile.displayName.charAt(0)
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-slate-800">
                    {profile.displayName}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                    LINE Connected
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono">
                  ID: {profile.userId}
                </p>
              </div>
            </div>
          </div>

          {isMockMode && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                โหมดจำลอง LIFF (สลับบัญชีทดสอบ):
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    switchMockUser("TEACHER");
                    setReporterName("อาจารย์สมชาย ใจดี");
                    setReporterRole("TEACHER");
                  }}
                  className={`px-2 py-1 rounded border text-xs transition ${
                    profile.userId === "U_MOCK_USER_001"
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  ครูสมชาย
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchMockUser("STAFF");
                    setReporterName("คุณวิภา รักงาน (ธุรการ)");
                    setReporterRole("STAFF");
                  }}
                  className={`px-2 py-1 rounded border text-xs transition ${
                    profile.userId === "U_MOCK_USER_002"
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  เจ้าหน้าที่วิภา
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchMockUser("STUDENT");
                    setReporterName("ด.ช.ปิติ รักเรียน (ม.4/1)");
                    setReporterRole("STUDENT");
                  }}
                  className={`px-2 py-1 rounded border text-xs transition ${
                    profile.userId === "U_MOCK_USER_003"
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  นักเรียน
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Success Screen */}
        {submittedTicket ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-200 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                รหัสใบแจ้งซ่อม: {submittedTicket.ticketCode}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-3">
                ส่งเรื่องแจ้งซ่อมเรียบร้อยแล้ว!
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {submittedTicket.problemTitle} ({submittedTicket.room})
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 text-left text-xs text-slate-600 border border-slate-200 space-y-1">
              <div className="font-semibold text-slate-800">
                สถานะการแจ้งเตือนผ่าน LINE OA:
              </div>
              {submittedTicket.lineSent ? (
                <p className="text-emerald-700">
                  ส่งการ์ดใบแจ้งซ่อม (Flex Message) เข้าสู่แชท LINE ของคุณเรียบร้อยแล้ว
                </p>
              ) : (
                <p className="text-slate-500">
                  บันทึกข้อมูลลงระบบแล้ว ({submittedTicket.lineReason})
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <Link
                href="/liff/my-repairs"
                className="flex-1 py-2.5 px-4 rounded-xl bg-line hover:bg-line-dark text-white font-semibold text-sm transition text-center"
              >
                ดูสถานะงานซ่อมของฉัน
              </Link>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition"
              >
                แจ้งซ่อมรายการอื่นเพิ่ม
              </button>
            </div>
          </div>
        ) : (
          /* Repair Form */
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-5"
          >
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Section 1: Reporter Info */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b pb-2">
                <UserCheck className="w-4 h-4 text-line" />
                <span>1. ข้อมูลผู้แจ้งซ่อม</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    ชื่อ-นามสกุล ผู้แจ้ง <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="เช่น อาจารย์สมชาย ใจดี"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-line"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    สถานะผู้แจ้ง <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={reporterRole}
                    onChange={(e) => setReporterRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-line"
                  >
                    {Object.entries(REPORTER_ROLES).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  เบอร์โทรศัพท์ติดต่อกลับ (ถ้ามี)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="เช่น 081-234-5678"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-line"
                />
              </div>
            </div>

            {/* Section 2: Location & Device */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b pb-2">
                <Wrench className="w-4 h-4 text-line" />
                <span>2. สถานที่และอุปกรณ์ที่มีปัญหา</span>
              </h2>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ห้องเรียน / ห้องพักครู / หน่วยงาน{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <select
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-line"
                >
                  {SCHOOL_ROOMS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    ประเภทอุปกรณ์ <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-line"
                  >
                    {Object.entries(DEVICE_TYPES).map(([key, info]) => (
                      <option key={key} value={key}>
                        {info.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    หมายเลขเครื่อง / รหัสครุภัณฑ์
                  </label>
                  <input
                    type="text"
                    value={assetCode}
                    onChange={(e) => setAssetCode(e.target.value)}
                    placeholder="เช่น PC-05, เครื่องครู, 7440-001"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-line"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ระดับความเร่งด่วน <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(URGENCY_LEVELS).map(([key, info]) => (
                    <label
                      key={key}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                        urgency === key
                          ? "border-line bg-emerald-50/60 font-semibold text-slate-900"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="urgency"
                        value={key}
                        checked={urgency === key}
                        onChange={() => setUrgency(key)}
                        className="accent-line"
                      />
                      <span>{info.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Problem Details & Image */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b pb-2">
                <ClipboardList className="w-4 h-4 text-line" />
                <span>3. อาการเสียและรูปภาพประกอบ</span>
              </h2>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  หัวข้อปัญหา / อาการเสียโดยย่อ{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={problemTitle}
                  onChange={(e) => setProblemTitle(e.target.value)}
                  placeholder="เช่น เปิดเครื่องไม่ติด, เชื่อมต่อเน็ตไม่ได้, โปรเจคเตอร์ภาพไม่ขึ้น"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-line"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  รายละเอียดอาการเสียเพิ่มเติม{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={problemDetail}
                  onChange={(e) => setProblemDetail(e.target.value)}
                  placeholder="อธิบายอาการที่พบ เช่น มีเสียงร้องปี๊บๆ, หน้าจอขึ้นข้อความ Error หรือคาบเรียนที่ต้องการใช้งาน..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-line"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  แนบรูปถ่ายหน้าจอหรืออุปกรณ์ที่มีปัญหา (ถ้ามี)
                </label>

                {imageUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt="Uploaded preview"
                      className="w-full max-h-56 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl(null)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-line rounded-xl p-4 cursor-pointer bg-slate-50/50 transition">
                    {uploadingImage ? (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Loader2 className="w-4 h-4 animate-spin text-line" />
                        <span>กำลังอัปโหลดรูปภาพ...</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-slate-400 mb-1" />
                        <span className="text-xs font-medium text-slate-600">
                          แตะเพื่อถ่ายรูป หรือเลือกไฟล์รูปภาพ
                        </span>
                        <span className="text-[11px] text-slate-400">
                          รองรับไฟล์ JPG, PNG
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="w-full py-3 px-4 rounded-xl bg-line hover:bg-line-dark disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-line/25 transition flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังบันทึกและส่งแจ้งเตือนเข้า LINE...</span>
                </>
              ) : (
                <>
                  <Wrench className="w-4 h-4" />
                  <span>ยืนยันการแจ้งซ่อม</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

