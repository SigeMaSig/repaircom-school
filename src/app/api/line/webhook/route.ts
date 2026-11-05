import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { buildRepairFlexMessage, getLineClient } from "@/lib/line";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-line-signature") || "";
    const channelSecret = process.env.LINE_CHANNEL_SECRET || "";

    // Verify signature if LINE_CHANNEL_SECRET is configured
    if (channelSecret) {
      const hash = crypto
        .createHmac("SHA256", channelSecret)
        .update(rawBody)
        .digest("base64");
      if (hash !== signature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const body = JSON.parse(rawBody);
    const events = body.events || [];
    const client = getLineClient();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    for (const event of events) {
      if (event.type === "message" && event.message.type === "text") {
        const text = (event.message.text || "").trim();
        const replyToken = event.replyToken;
        const userId = event.source?.userId;

        if (!client || !replyToken) continue;

        if (
          text.includes("แจ้งซ่อม") ||
          text.toLowerCase() === "repair"
        ) {
          await client.replyMessage({
            replyToken,
            messages: [
              {
                type: "text",
                text: `🛠️ แจ้งซ่อมคอมพิวเตอร์และอุปกรณ์ไอทีโรงเรียน\nคลิกที่ลิงก์ด้านล่างเพื่อกรอกแบบฟอร์มแจ้งซ่อมได้เลยครับ:\n${appUrl}/liff/repair`,
              },
            ],
          });
        } else if (
          text.includes("สถานะ") ||
          text.includes("ติดตาม") ||
          text.toLowerCase() === "status"
        ) {
          const latestTicket = userId
            ? await prisma.repairTicket.findFirst({
                where: { lineUserId: userId },
                orderBy: { createdAt: "desc" },
              })
            : null;

          if (latestTicket) {
            const flexMsg = buildRepairFlexMessage(latestTicket, "UPDATED");
            await client.replyMessage({
              replyToken,
              messages: [flexMsg],
            });
          } else {
            await client.replyMessage({
              replyToken,
              messages: [
                {
                  type: "text",
                  text: `ยังไม่มีประวัติการแจ้งซ่อมของคุณในระบบครับ\nสามารถแจ้งซ่อมได้ที่: ${appUrl}/liff/repair`,
                },
              ],
            });
          }
        } else if (text.toUpperCase().startsWith("REP-")) {
          const ticket = await prisma.repairTicket.findUnique({
            where: { ticketCode: text.toUpperCase() },
          });

          if (ticket) {
            const flexMsg = buildRepairFlexMessage(ticket, "UPDATED");
            await client.replyMessage({
              replyToken,
              messages: [flexMsg],
            });
          } else {
            await client.replyMessage({
              replyToken,
              messages: [
                {
                  type: "text",
                  text: `ไม่พบรหัสใบแจ้งซ่อม ${text.toUpperCase()} ในระบบครับ`,
                },
              ],
            });
          }
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("LINE Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

