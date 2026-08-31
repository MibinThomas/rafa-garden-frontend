"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SiteSettings {
  [key: string]: any;
}

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({
    "global.brand_name": "Rafah Garden",
    "global.contact_email": "hello@rafagarden.com",
    "global.contact_phone": "+971 00 000 0000",
    "global.social_instagram": "https://instagram.com/rafagarden",
    "global.social_whatsapp": "https://wa.me/971000000000",
    "global.whatsapp_order_number": "918550088485",
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      
      if (!res.ok) {
        console.warn(`Failed to fetch site settings: ${res.status}`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      
      if (data && typeof data === 'object' && !data.error) {
        if (Array.isArray(data)) {
          const settingsMap: any = {};
          data.forEach((item: any) => {
            settingsMap[item.key] = item.value;
          });
          setSettings(prev => ({ ...prev, ...settingsMap }));
        } else {
          setSettings(prev => ({ ...prev, ...data }));
        }
      }
    } catch (err) {
      console.error("Failed to load global settings", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  }
  return context;
}
