import React, { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

const DemoInitializer: React.FC = () => {
  const { createSession, sessions } = useAppStore();

  useEffect(() => {
    // Only initialize if no sessions exist
    if (sessions.length === 0) {
      // Create a sample chat session
      createSession("Tax Data Analysis");
    }
  }, [sessions.length, createSession]);

  return null;
};

export default DemoInitializer;
