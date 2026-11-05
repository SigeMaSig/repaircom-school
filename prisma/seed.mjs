import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.repairTicket.count();
  if (count > 0) {
    console.log('Database already has seed data.');
    return;
  }

  await prisma.repairTicket.createMany({
    data: [
      {
        ticketCode: 'REP-2026-001',
        lineUserId: 'U_MOCK_USER_001',
        lineDisplayName: 'ครูสมชาย ใจดี',
        linePictureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        reporterName: 'อาจารย์สมชาย ใจดี',
        reporterRole: 'TEACHER',
        phone: '081-234-5678',
        room: 'ห้องปฏิบัติการคอมพิวเตอร์ 1 (อาคาร 2 ชั้น 3)',
        assetCode: 'PC-12',
        deviceType: 'PC',
        urgency: 'URGENT',
        problemTitle: 'เปิดเครื่องไม่ติด จอฟ้า (Blue Screen)',
        problemDetail: 'เครื่องนักเรียนแถวที่ 2 เครื่องที่ 12 เปิดติดแล้วขึ้นจอฟ้ารหัส CRITICAL_PROCESS_DIED ต้องใช้สอนคาบบ่ายครับ',
        status: 'IN_PROGRESS',
        technicianName: 'ช่างเอก (งานโสตฯ/ไอที)',
        adminNote: 'กำลังตรวจสอบ RAM และลง Windows 11 ใหม่ครับ',
      },
      {
        ticketCode: 'REP-2026-002',
        lineUserId: 'U_MOCK_USER_001',
        lineDisplayName: 'ครูสมชาย ใจดี',
        linePictureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        reporterName: 'อาจารย์สมชาย ใจดี',
        reporterRole: 'TEACHER',
        phone: '081-234-5678',
        room: 'ห้องปฏิบัติการคอมพิวเตอร์ 2 (อาคาร 2 ชั้น 3)',
        assetCode: 'PROJ-COM2',
        deviceType: 'PROJECTOR',
        urgency: 'CRITICAL',
        problemTitle: 'โปรเจคเตอร์หน้าห้องภาพไม่ออก สาย HDMI หลวม',
        problemDetail: 'เสียบสาย HDMI กับเครื่องครูแล้วภาพกระพริบติดๆ ดับๆ ตอนนี้ใช้สอนไม่ได้เลยครับ',
        status: 'PENDING',
        technicianName: null,
        adminNote: null,
      },
      {
        ticketCode: 'REP-2026-003',
        lineUserId: 'U_MOCK_USER_002',
        lineDisplayName: 'ครูวิภา ธุรการ',
        linePictureUrl: null,
        reporterName: 'คุณวิภา รักงาน (เจ้าหน้าที่ธุรการ)',
        reporterRole: 'STAFF',
        phone: '089-876-5432',
        room: 'ห้องธุรการ / การเงิน (อาคาร 1 ชั้น 1)',
        assetCode: 'PRN-ADM-01',
        deviceType: 'PRINTER',
        urgency: 'NORMAL',
        problemTitle: 'เครื่องปริ้นเตอร์กระดาษติดและหมึกดำไม่ออก',
        problemDetail: 'Epson L3250 ดึงกระดาษซ้อนกันแล้วติด พอดึงออกแล้วสั่งพิมพ์สีดำเป็นเส้นขาดๆ',
        status: 'COMPLETED',
        technicianName: 'ช่างนนท์ (ศูนย์คอมฯ)',
        adminNote: 'ทำความสะอาดลูกยางดึงกระดาษ และสั่งล้างหัวพิมพ์ (Head Cleaning) เรียบร้อย ทดสอบพิมพ์ใช้งานได้ปกติครับ',
      },
    ],
  });

  console.log('Seeded sample school computer repair tickets successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

