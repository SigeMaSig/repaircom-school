"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useLiff } from "@/components/LiffProvider";
import {
  DEVICE_TYPES,
  REPAIR_STATUSES,
  URGENCY_LEVELS,
} from "@/lib/constants";
import {
  ClipboardList,
  PlusCircle,
  RefreshCw,
  MapPin,
  Monitor,
  User,
  Clock,
  Home,
  Sparkles,
  Wrench,
} from "lucide-react";

interface Ticket {
  id: string;
  ticketCode: string;
  lineUserId: string;
  reporterName: string;
  reporterRole: string;
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

export default function MyRepairsPage() {
  const { profile, isReady } = useLiff();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyTickets = useCallback(async () => {
    if (!profile?.userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const query = `?lineUserId=${encodeURIComponent(profile.userId)}`;
      const res = await fetch(`/api/repairs${query}`);
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (err) {
      console.error("Error fetching my tickets:", err);
    } finally {
      setLoading(false);
    }
  }, [profile?.userId]);

  useEffect(() => {
    if (isReady && profile?.userId) {
      fetchMyTickets();
    }
  }, [isReady, profile?.userId, fetchMyTickets]);

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      {/* Header */}
      <div className="bg-line text-white shadow-md sticky top-0 z-20">
        <div className="max-w-lg mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">
                ติดตามสถานะงานซ่อม
              </h1>
              <p className="text-xs text-white/90">
                รายการแจ้งซ่อมของ {profile?.displayName || "คุณ"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href="/liff/repair"
              className="px-2.5 py-1.5 rounded-lg bg-white text-line font-semibold text-xs flex items-center gap-1 shadow-sm hover:bg-slate-50 transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>แจ้งซ่อมใหม่</span>
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
        {/* Refresh Bar */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={fetchMyTickets}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>รีเฟรชรายการ</span>
          </button>
        </div>

        {/* Ticket List */}
        {loading ? (
          <div className="bg-white rounded-2xl p-8 text-center text-sm text-slate-500 border border-slate-200">
            กำลังโหลดรายการแจ้งซ่อม...
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center space-y-3 border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Wrench className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-slate-700">
              ยังไม่มีรายการแจ้งซ่อมของคุณ
            </div>
            <p className="text-xs text-slate-500">
              หากพบปัญหาคอมพิวเตอร์หรืออุปกรณ์ไอทีในห้องเรียน สามารถกดแจ้งซ่อมได้ทันที
            </p>
            <Link
              href="/liff/repair"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-line text-white text-xs font-semibold"
            >
              <PlusCircle className="w-4 h-4" />
              <span>สร้างใบแจ้งซ่อมใหม่</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => {
              const statusInfo =
                REPAIR_STATUSES[ticket.status] || REPAIR_STATUSES.PENDING;
              const urgencyInfo =
                URGENCY_LEVELS[ticket.urgency] || URGENCY_LEVELS.NORMAL;
              const deviceInfo = DEVICE_TYPES[ticket.deviceType] || {
                label: ticket.deviceType,
              };

              return (
                <div
                  key={ticket.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {ticket.ticketCode}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusInfo.badgeClass}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      {ticket.problemTitle}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {ticket.problemDetail}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-800">
                        {ticket.room}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Monitor className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        {deviceInfo.label}
                        {ticket.assetCode ? ` (${ticket.assetCode})` : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/70 mt-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-medium border ${urgencyInfo.badgeClass}`}
                      >
                        {urgencyInfo.label}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(ticket.createdAt).toLocaleString("th-TH", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                  </div>

                  {ticket.imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ticket.imageUrl}
                        alt={ticket.problemTitle}
                        className="w-full max-h-48 object-contain"
                      />
                    </div>
                  )}

                  {(ticket.technicianName || ticket.adminNote) && (
                    <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-3 text-xs space-y-1">
                      <div className="font-semibold text-emerald-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          ช่างผู้รับผิดชอบ:{" "}
                          {ticket.technicianName || "กำลังมอบหมาย"}
                        </span>
                      </div>
                      {ticket.adminNote && (
                        <p className="text-emerald-800 pl-5">
                          หมายเหตุการซ่อม: {ticket.adminNote}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

