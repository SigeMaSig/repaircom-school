import { messagingApi } from "@line/bot-sdk";
import { RepairTicket } from "@prisma/client";
import { DEVICE_TYPES, REPAIR_STATUSES, URGENCY_LEVELS } from "./constants";

const { MessagingApiClient } = messagingApi;

export function getLineClient() {
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!channelAccessToken) {
    return null;
  }
  return new MessagingApiClient({
    channelAccessToken,
  });
}

export function buildRepairFlexMessage(
  ticket: RepairTicket,
  eventType: "CREATED" | "UPDATED"
): messagingApi.FlexMessage {
  const statusInfo = REPAIR_STATUSES[ticket.status] || REPAIR_STATUSES.PENDING;
  const deviceInfo = DEVICE_TYPES[ticket.deviceType] || {
    label: ticket.deviceType,
  };
  const urgencyInfo =
    URGENCY_LEVELS[ticket.urgency] || URGENCY_LEVELS.NORMAL;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const headerTitle =
    eventType === "CREATED"
      ? "แจ้งซ่อมคอมพิวเตอร์สำเร็จ"
      : "อัปเดตสถานะงานซ่อม";

  const bodyContents: messagingApi.FlexComponent[] = [
    {
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "text",
          text: ticket.ticketCode,
          weight: "bold",
          size: "md",
          color: "#1E293B",
        },
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: statusInfo.label,
              size: "xs",
              color: statusInfo.colorHex,
              weight: "bold",
              align: "center",
            },
          ],
          backgroundColor: statusInfo.bgHex,
          cornerRadius: "md",
          paddingAll: "4px",
          paddingStart: "8px",
          paddingEnd: "8px",
          flex: 0,
        },
      ],
      justifyContent: "space-between",
      alignItems: "center",
    },
    {
      type: "text",
      text: ticket.problemTitle,
      weight: "bold",
      size: "lg",
      margin: "md",
      wrap: true,
      color: "#0F172A",
    },
    {
      type: "separator",
      margin: "md",
    },
    {
      type: "box",
      layout: "vertical",
      margin: "md",
      spacing: "sm",
      contents: [
        {
          type: "box",
          layout: "baseline",
          spacing: "sm",
          contents: [
            {
              type: "text",
              text: "สถานที่",
              color: "#64748B",
              size: "sm",
              flex: 3,
            },
            {
              type: "text",
              text: ticket.room,
              wrap: true,
              color: "#1E293B",
              size: "sm",
              flex: 7,
              weight: "bold",
            },
          ],
        },
        {
          type: "box",
          layout: "baseline",
          spacing: "sm",
          contents: [
            {
              type: "text",
              text: "อุปกรณ์",
              color: "#64748B",
              size: "sm",
              flex: 3,
            },
            {
              type: "text",
              text: `${deviceInfo.label}${
                ticket.assetCode ? ` (${ticket.assetCode})` : ""
              }`,
              wrap: true,
              color: "#1E293B",
              size: "sm",
              flex: 7,
            },
          ],
        },
        {
          type: "box",
          layout: "baseline",
          spacing: "sm",
          contents: [
            {
              type: "text",
              text: "ความเร่งด่วน",
              color: "#64748B",
              size: "sm",
              flex: 3,
            },
            {
              type: "text",
              text: urgencyInfo.label,
              wrap: true,
              color: urgencyInfo.colorHex,
              size: "sm",
              flex: 7,
              weight: "bold",
            },
          ],
        },
        {
          type: "box",
          layout: "baseline",
          spacing: "sm",
          contents: [
            {
              type: "text",
              text: "ผู้แจ้ง",
              color: "#64748B",
              size: "sm",
              flex: 3,
            },
            {
              type: "text",
              text: ticket.reporterName,
              wrap: true,
              color: "#1E293B",
              size: "sm",
              flex: 7,
            },
          ],
        },
      ],
    },
  ];

  if (ticket.technicianName || ticket.adminNote) {
    bodyContents.push(
      {
        type: "separator",
        margin: "md",
      },
      {
        type: "box",
        layout: "vertical",
        margin: "md",
        spacing: "xs",
        backgroundColor: "#F8FAFC",
        cornerRadius: "md",
        paddingAll: "10px",
        contents: [
          {
            type: "text",
            text: `ช่างผู้รับผิดชอบ: ${ticket.technicianName || "กำลังมอบหมาย"}`,
            size: "xs",
            weight: "bold",
            color: "#334155",
            wrap: true,
          },
          ...(ticket.adminNote
            ? [
                {
                  type: "text" as const,
                  text: `บันทึกจากช่าง: ${ticket.adminNote}`,
                  size: "xs" as const,
                  color: "#475569",
                  wrap: true,
                  margin: "xs" as const,
                },
              ]
            : []),
        ],
      }
    );
  }

  return {
    type: "flex",
    altText: `[${headerTitle}] ${ticket.ticketCode} - ${ticket.problemTitle} (${statusInfo.label})`,
    contents: {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: statusInfo.colorHex,
        paddingAll: "14px",
        contents: [
          {
            type: "text",
            text: "ศูนย์ซ่อมคอมพิวเตอร์และไอทีโรงเรียน",
            color: "#FFFFFFCC",
            size: "xs",
          },
          {
            type: "text",
            text: headerTitle,
            color: "#FFFFFF",
            size: "md",
            weight: "bold",
            margin: "xs",
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: bodyContents,
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          {
            type: "button",
            style: "primary",
            height: "sm",
            color: "#06C755",
            action: {
              type: "uri",
              label: "ดูรายละเอียด / ติดตามสถานะ",
              uri: `${appUrl}/liff/my-repairs`,
            },
          },
        ],
      },
    },
  };
}

export async function sendRepairNotificationToUser(
  ticket: RepairTicket,
  eventType: "CREATED" | "UPDATED"
): Promise<{ sent: boolean; reason?: string }> {
  const client = getLineClient();
  if (!client) {
    return {
      sent: false,
      reason: "ยังไม่ได้ตั้งค่า LINE_CHANNEL_ACCESS_TOKEN ในไฟล์ .env (ทำงานในโหมดจำลอง)",
    };
  }

  if (!ticket.lineUserId || ticket.lineUserId.startsWith("U_MOCK")) {
    return {
      sent: false,
      reason: "ผู้ใช้นี้เป็นบัญชีทดสอบ (Mock User) จึงไม่ได้ส่ง Push Message ไปยัง LINE จริง",
    };
  }

  try {
    const flexMessage = buildRepairFlexMessage(ticket, eventType);
    await client.pushMessage({
      to: ticket.lineUserId,
      messages: [flexMessage],
    });
    return { sent: true };
  } catch (error: unknown) {
    console.error("Failed to send LINE Push Message:", error);
    return {
      sent: false,
      reason: error instanceof Error ? error.message : "LINE API Error",
    };
  }
}

