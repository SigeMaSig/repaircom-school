import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendRepairNotificationToUser } from "@/lib/line";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lineUserId = searchParams.get("lineUserId");
    const status = searchParams.get("status");
    const urgency = searchParams.get("urgency");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (lineUserId) {
      where.lineUserId = lineUserId;
    }
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (urgency && urgency !== "ALL") {
      where.urgency = urgency;
    }
    if (search) {
      where.OR = [
        { ticketCode: { contains: search } },
        { problemTitle: { contains: search } },
        { room: { contains: search } },
        { reporterName: { contains: search } },
        { assetCode: { contains: search } },
      ];
    }

    const tickets = await prisma.repairTicket.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("GET /api/repairs error:", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลรายการแจ้งซ่อมได้" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      lineUserId,
      lineDisplayName,
      linePictureUrl,
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
    } = body;

    if (!reporterName || !room || !deviceType || !problemTitle || !problemDetail) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน" },
        { status: 400 }
      );
    }

    // Generate unique ticketCode e.g. REP-2026-004
    const year = new Date().getFullYear();
    const count = await prisma.repairTicket.count();
    const nextNumber = String(count + 1).padStart(3, "0");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const candidateCode = `REP-${year}-${nextNumber}`;

    // Ensure uniqueness
    const existing = await prisma.repairTicket.findUnique({
      where: { ticketCode: candidateCode },
    });
    const finalTicketCode = existing
      ? `REP-${year}-${nextNumber}-${randomSuffix}`
      : candidateCode;

    const ticket = await prisma.repairTicket.create({
      data: {
        ticketCode: finalTicketCode,
        lineUserId: lineUserId || "U_MOCK_USER_001",
        lineDisplayName: lineDisplayName || reporterName,
        linePictureUrl: linePictureUrl || null,
        reporterName,
        reporterRole: reporterRole || "TEACHER",
        phone: phone || null,
        room,
        assetCode: assetCode || null,
        deviceType,
        urgency: urgency || "NORMAL",
        problemTitle,
        problemDetail,
        imageUrl: imageUrl || null,
        status: "PENDING",
      },
    });

    let lineResult: { sent: boolean; reason?: string } = { sent: false, reason: "" };
    try {
      lineResult = await sendRepairNotificationToUser(ticket, "CREATED");
    } catch (lineErr) {
      console.error("Non-blocking LINE notification error:", lineErr);
    }

    return NextResponse.json({
      ticket,
      lineNotification: lineResult,
    });
  } catch (error: any) {
    console.error("POST /api/repairs error:", error);
    return NextResponse.json(
      { error: error?.message || "เกิดข้อผิดพลาดในการบันทึกใบแจ้งซ่อม" },
      { status: 500 }
    );
  }
}

