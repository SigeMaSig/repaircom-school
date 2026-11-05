"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

interface LiffContextType {
  profile: LineProfile | null;
  isReady: boolean;
  error: string | null;
}

const LiffContext = createContext<LiffContextType>({
  profile: null,
  isReady: false,
  error: null,
});

export function LiffProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<LineProfile | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

    async function initLiff() {
      if (!liffId) {
        setError("ไม่พบการตั้งค่า NEXT_PUBLIC_LIFF_ID");
        setIsReady(true);
        return;
      }

      try {
        const liff = (await import("@line/liff")).default;
        await liff.init({ liffId });

        if (liff.isLoggedIn()) {
          const userProfile = await liff.getProfile();
          setProfile({
            userId: userProfile.userId,
            displayName: userProfile.displayName,
            pictureUrl: userProfile.pictureUrl,
          });
        } else {
          // หากเปิดผ่าน Browser หรือยังไม่ได้ล็อกอิน ให้เด้งหน้า LINE Login อัตโนมัติ
          liff.login();
          return;
        }
      } catch (err: unknown) {
        console.error("LIFF initialization error:", err);
        setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ LINE");
      } finally {
        setIsReady(true);
      }
    }

    initLiff();
  }, []);

  return (
    <LiffContext.Provider value={{ profile, isReady, error }}>
      {children}
    </LiffContext.Provider>
  );
}

export function useLiff() {
  return useContext(LiffContext);
}


