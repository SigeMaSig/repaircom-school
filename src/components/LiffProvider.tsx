"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

interface LiffContextType {
  profile: LineProfile;
  isMockMode: boolean;
  isReady: boolean;
  switchMockUser: (preset: "TEACHER" | "STAFF" | "STUDENT") => void;
}

const MOCK_PROFILES: Record<"TEACHER" | "STAFF" | "STUDENT", LineProfile> = {
  TEACHER: {
    userId: "Ud8b401a819d9ab0c1cd6e63cc48de124",
    displayName: "ครูแอดมิน (คุณ)",
    pictureUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  STAFF: {
    userId: "Ud8b401a819d9ab0c1cd6e63cc48de124",
    displayName: "ครูวิภา ธุรการ",
  },
  STUDENT: {
    userId: "Ud8b401a819d9ab0c1cd6e63cc48de124",
    displayName: "ด.ช.ปิติ รักเรียน (ม.4/1)",
  },
};

const LiffContext = createContext<LiffContextType>({
  profile: MOCK_PROFILES.TEACHER,
  isMockMode: true,
  isReady: false,
  switchMockUser: () => {},
});

export function LiffProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<LineProfile>(MOCK_PROFILES.TEACHER);
  const [isMockMode, setIsMockMode] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

    async function initLiff() {
      if (!liffId) {
        setIsMockMode(true);
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
          setIsMockMode(false);
        } else if (liff.isInClient()) {
          liff.login();
          return;
        } else {
          // Opened in external browser without login -> fallback to mock mode for convenience
          setIsMockMode(true);
        }
      } catch (err) {
        console.warn("LIFF init fallback to Mock Mode:", err);
        setIsMockMode(true);
      } finally {
        setIsReady(true);
      }
    }

    initLiff();
  }, []);

  const switchMockUser = (preset: "TEACHER" | "STAFF" | "STUDENT") => {
    setProfile(MOCK_PROFILES[preset]);
  };

  return (
    <LiffContext.Provider
      value={{ profile, isMockMode, isReady, switchMockUser }}
    >
      {children}
    </LiffContext.Provider>
  );
}

export function useLiff() {
  return useContext(LiffContext);
}

