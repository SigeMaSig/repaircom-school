import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendRepairNotificationToUser } from "@/lib/line";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, technicianName, adminNote, sendLineNotify = true } = body;

    const existing = await prisma.repairTicket.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "ไม่พบรายการแจ้งซ่อมนี้" },
        { status: 404 }
      );
    }

    const updatedTicket = await prisma.repairTicket.update({
      where: { id },
      data: {
        status: status ?? existing.status,
        technicianName:
          technicianName !== undefined ? technicianName : existing.technicianName,
        adminNote: adminNote !== undefined ? adminNote : existing.adminNote,
      },
    });

    let lineResult: { sent: boolean; reason?: string } = {
      sent: false,
      reason: "ปิดการแจ้งเตือน",
    };
    if (sendLineNotify) {
      lineResult = await sendRepairNotificationToUser(updatedTicket, "UPDATED");
    }

    return NextResponse.json({
      ticket: updatedTicket,
      lineNotification: lineResult,
    });
  } catch (error) {
    console.error("PATCH /api/repairs/[id] error:", error);
    return NextResponse.json(
      { error: "ไม่สามารถอัปเดตสถานะงานซ่อมได้" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.repairTicket.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/repairs/[id] error:", error);
    return NextResponse.json(
      { error: "ไม่สามารถลบรายการแจ้งซ่อมได้" },
      { status: 500 }
    );
  }
}

