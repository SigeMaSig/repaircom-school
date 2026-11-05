"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  DEVICE_TYPES,
  REPAIR_STATUSES,
  REPORTER_ROLES,
  URGENCY_LEVELS,
} from "@/lib/constants";
import {
  ShieldCheck,
  Search,
  RefreshCw,
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Monitor,
  User,
  Phone,
  Send,
  Trash2,
  Home,
  X,
  Loader2,
} from "lucide-react";

interface Ticket {
  id: string;
  ticketCode: string;
  lineUserId: string;
  lineDisplayName: string;
  linePictureUrl: string | null;
  reporterName: string;
  reporterRole: string;
  phone: string | null;
  room: string;
  assetCode: string | null;
  deviceType: string;
  urgency: string;
  problemTitle: string;
  problemDetail: string;
  imageUrl: string | null;
  status: string;
  technicianName: string | null;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [urgencyFilter, setUrgencyFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Selected Ticket Modal State
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [editStatus, setEditStatus] = useState("PENDING");
  const [editTechnician, setEditTechnician] = useState("");
  const [editAdminNote, setEditAdminNote] = useState("");
  const [sendLineNotify, setSendLineNotify] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (urgencyFilter !== "ALL") params.set("urgency", urgencyFilter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/repairs?${params.toString()}`);
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, urgencyFilter, searchQuery]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const openManageModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setEditStatus(ticket.status);
    setEditTechnician(ticket.technicianName || "");
    setEditAdminNote(ticket.adminNote || "");
    setSendLineNotify(true);
  };

  const handleUpdateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/repairs/${selectedTicket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          technicianName: editTechnician,
          adminNote: editAdminNote,
          sendLineNotify,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "อัปเดตไม่สำเร็จ");
      }

      const lineNote = data.lineNotification?.sent
        ? "และส่ง Flex Message แจ้งผู้แจ้งใน LINE แล้ว"
        : `(${data.lineNotification?.reason || "ไม่ได้ส่ง LINE"})`;

      setFeedbackBanner(
        `อัปเดตใบแจ้งซ่อม ${data.ticket.ticketCode} เรียบร้อยแล้ว ${lineNote}`
      );
      setSelectedTicket(null);
      fetchTickets();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTicket = async (ticket: Ticket) => {
    if (
      !window.confirm(
        `ต้องการลบใบแจ้งซ่อม ${ticket.ticketCode} (${ticket.problemTitle}) ใช่หรือไม่?`
      )
    ) {
      return;
    }

    try {
      await fetch(`/api/repairs/${ticket.id}`, { method: "DELETE" });
      setFeedbackBanner(`ลบใบแจ้งซ่อม ${ticket.ticketCode} เรียบร้อยแล้ว`);
      if (selectedTicket?.id === ticket.id) {
        setSelectedTicket(null);
      }
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  // Summary Counts
  const totalCount = tickets.length;
  const pendingCount = tickets.filter((t) => t.status === "PENDING").length;
  const inProgressCount = tickets.filter(
    (t) => t.status === "IN_PROGRESS" || t.status === "WAITING_PARTS"
  ).length;
  const completedCount = tickets.filter((t) => t.status === "COMPLETED").length;

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">
                ระบบบริหารงานซ่อมคอมพิวเตอร์และไอทีโรงเรียน (Admin Dashboard)
              </h1>
              <p className="text-xs text-slate-400">
                สำหรับครูคอมพิวเตอร์และช่างเทคนิค — อัปเดตสถานะพร้อมแจ้งเตือนกลับทาง LINE OA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/liff/repair"
              className="px-3 py-2 rounded-lg bg-line hover:bg-line-dark text-white text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>ไปหน้าแจ้งซ่อม (LIFF)</span>
            </Link>
            <Link
              href="/"
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>หน้าแรก</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        {feedbackBanner && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-between">
            <span>{feedbackBanner}</span>
            <button
              onClick={() => setFeedbackBanner(null)}
              className="text-emerald-700 hover:text-emerald-950"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">
                รายการที่แสดงทั้งหมด
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {totalCount}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Monitor className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-700 font-medium">
                รอรับเรื่อง (Pending)
              </p>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {pendingCount}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-700 font-medium">
                กำลังซ่อม / รออะไหล่
              </p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {inProgressCount}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-700 font-medium">
                ซ่อมเสร็จสิ้นแล้ว
              </p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {completedCount}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหารหัสใบแจ้งซ่อม, ห้องเรียน, หมายเลขเครื่อง (เช่น PC-12), ชื่อครู..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm bg-white"
            >
              <option value="ALL">ทุกสถานะงานซ่อม</option>
              {Object.entries(REPAIR_STATUSES).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>

            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm bg-white"
            >
              <option value="ALL">ทุกระดับความเร่งด่วน</option>
              {Object.entries(URGENCY_LEVELS).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={fetchTickets}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>รีเฟรช</span>
            </button>
          </div>
        </div>

        {/* Tickets Table / Cards */}
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
            กำลังโหลดข้อมูลรายการแจ้งซ่อม...
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
            ไม่พบรายการแจ้งซ่อมที่ตรงกับเงื่อนไข
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {tickets.map((ticket) => {
              const statusInfo =
                REPAIR_STATUSES[ticket.status] || REPAIR_STATUSES.PENDING;
              const urgencyInfo =
                URGENCY_LEVELS[ticket.urgency] || URGENCY_LEVELS.NORMAL;
              const deviceInfo = DEVICE_TYPES[ticket.deviceType] || {
                label: ticket.deviceType,
              };
              const roleLabel =
                REPORTER_ROLES[ticket.reporterRole] || ticket.reporterRole;

              return (
                <div
                  key={ticket.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition flex flex-col lg:flex-row gap-5 justify-between"
                >
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                        {ticket.ticketCode}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusInfo.badgeClass}`}
                      >
                        {statusInfo.label}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${urgencyInfo.badgeClass}`}
                      >
                        {urgencyInfo.label}
                      </span>
                      <span className="text-xs text-slate-400 ml-auto">
                        แจ้งเมื่อ:{" "}
                        {new Date(ticket.createdAt).toLocaleString("th-TH", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {ticket.problemTitle}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        {ticket.problemDetail}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1 text-xs text-slate-700">
                      <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="font-medium">{ticket.room}</span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                        <Monitor className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>
                          {deviceInfo.label}{" "}
                          {ticket.assetCode && (
                            <strong className="text-slate-900">
                              [{ticket.assetCode}]
                            </strong>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                        <User className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>
                          {ticket.reporterName} ({roleLabel})
                          {ticket.phone ? ` • ${ticket.phone}` : ""}
                        </span>
                      </div>
                    </div>

                    {(ticket.technicianName || ticket.adminNote) && (
                      <div className="bg-blue-50/60 border border-blue-200 rounded-xl px-3.5 py-2.5 text-xs text-blue-950 space-y-0.5">
                        <div>
                          <strong>ช่างผู้รับผิดชอบ:</strong>{" "}
                          {ticket.technicianName || "ยังไม่ระบุ"}
                        </div>
                        {ticket.adminNote && (
                          <div>
                            <strong>บันทึกการซ่อม:</strong> {ticket.adminNote}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right column: image thumbnail + action buttons */}
                  <div className="flex sm:flex-row lg:flex-col justify-between items-end gap-3 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                    {ticket.imageUrl ? (
                      <a
                        href={ticket.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-28 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0"
                        title="คลิกเพื่อดูรูปขนาดเต็ม"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ticket.imageUrl}
                          alt="รูปอาการเสีย"
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ) : (
                      <div className="text-[11px] text-slate-400">
                        ไม่มีรูปแนบ
                      </div>
                    )}

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => openManageModal(ticket)}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>อัปเดตสถานะ / แจ้ง LINE</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTicket(ticket)}
                        className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                        title="ลบรายการ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal for Updating Ticket Status & Sending LINE Notification */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                  {selectedTicket.ticketCode}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  อัปเดตสถานะงานซ่อม
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 text-xs space-y-1 border border-slate-200">
              <div className="font-bold text-slate-900 text-sm">
                {selectedTicket.problemTitle}
              </div>
              <p className="text-slate-600">{selectedTicket.problemDetail}</p>
              <div className="pt-1 text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                <span>สถานที่: {selectedTicket.room}</span>
                {selectedTicket.assetCode && (
                  <span>รหัสเครื่อง: {selectedTicket.assetCode}</span>
                )}
                <span>ผู้แจ้ง: {selectedTicket.reporterName}</span>
                {selectedTicket.phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {selectedTicket.phone}
                  </span>
                )}
              </div>
            </div>

            <form onSubmit={handleUpdateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  สถานะงานซ่อม
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {Object.entries(REPAIR_STATUSES).map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.label} — {info.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อช่าง / ผู้รับผิดชอบงานซ่อม
                </label>
                <input
                  type="text"
                  value={editTechnician}
                  onChange={(e) => setEditTechnician(e.target.value)}
                  placeholder="เช่น ช่างเอก (งานโสตฯ/ศูนย์คอมฯ), ครูธนพล"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  บันทึกการซ่อม / ข้อความแจ้งผู้แจ้งซ่อม
                </label>
                <textarea
                  rows={3}
                  value={editAdminNote}
                  onChange={(e) => setEditAdminNote(e.target.value)}
                  placeholder="ระบุสาเหตุหรือผลการแก้ไข เช่น เปลี่ยนสายแลนเส้นใหม่เรียบร้อย, ลงไดรเวอร์ปริ้นเตอร์ใหม่พร้อมใช้งานครับ"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendLineNotify}
                  onChange={(e) => setSendLineNotify(e.target.checked)}
                  className="accent-line w-4 h-4"
                />
                <div>
                  <div className="font-semibold flex items-center gap-1">
                    <Send className="w-3.5 h-3.5 text-line" />
                    <span>
                      ส่งการ์ดแจ้งเตือนสถานะ (Flex Message) ไปยัง LINE ของผู้แจ้งทันที
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    LINE User ID: {selectedTicket.lineUserId}
                  </p>
                </div>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-line hover:bg-line-dark text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-line/20"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>กำลังบันทึก...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>บันทึกและอัปเดตสถานะ</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

