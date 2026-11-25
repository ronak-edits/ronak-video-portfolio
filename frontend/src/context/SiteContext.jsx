import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { fetchSettings } from '../services/portfolioService';

const SiteContext = createContext(null);

export const SiteProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  const refreshSettings = useCallback(async () => {
    try {
      const data = await fetchSettings();
      setSettings(data);
    } catch {
      // Keep fallback placeholders if backend/DB is unavailable
    } finally {
      setIsLoadingSettings(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  // Apply dynamic SEO title and meta description when available
  useEffect(() => {
    if (settings?.seoTitle) {
      document.title = settings.seoTitle;
    }
    if (settings?.metaDescription) {
      const metaTag = document.querySelector('meta[name="description"]');
      if (metaTag) {
        metaTag.setAttribute('content', settings.metaDescription);
      }
    }
  }, [settings]);

  return (
    <SiteContext.Provider
      value={{
        settings,
        isLoadingSettings,
        refreshSettings,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteSettings = () => {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error('useSiteSettings must be used inside a SiteProvider');
  }
  return ctx;
};
