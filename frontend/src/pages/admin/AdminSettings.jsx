import { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save,
} from 'lucide-react';
import { fetchSettings, updateSettings } from '../../services/portfolioService';
import { useSiteSettings } from '../../context/SiteContext';
import CloudinaryUploadField from '../../components/admin/CloudinaryUploadField';

const INITIAL_SETTINGS = {
  contactEmail: '',
  phoneNumber: '',
  location: '',
  instagramUrl: '',
  youtubeUrl: '',
  linkedinUrl: '',
  showreelVideoUrl: '',
  showreelThumbnailUrl: '',
  seoTitle: 'Ronak — Video Editor Portfolio',
  metaDescription: '',
  copyrightText: '© 2026 RONAK. All rights reserved.',
};

const AdminSettings = () => {
  const { refreshSettings } = useSiteSettings();
  const [form, setForm] = useState(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let active = true;
    fetchSettings()
      .then((settings) => {
        if (!active) return;
        setForm({
          contactEmail: settings.contactEmail || '',
          phoneNumber: settings.phoneNumber || '',
          location: settings.location || '',
          instagramUrl: settings.instagramUrl || '',
          youtubeUrl: settings.youtubeUrl || '',
          linkedinUrl: settings.linkedinUrl || '',
          showreelVideoUrl: settings.showreelVideoUrl || '',
          showreelThumbnailUrl: settings.showreelThumbnailUrl || '',
          seoTitle: settings.seoTitle || 'Ronak — Video Editor Portfolio',
          metaDescription: settings.metaDescription || '',
          copyrightText:
            settings.copyrightText || '© 2026 RONAK. All rights reserved.',
        });
      })
      .catch((err) => {
        if (active) setError(err.message || 'Failed to load site settings.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSaving(true);

    try {
      const updated = await updateSettings(form);
      setForm((prev) => ({ ...prev, ...updated }));
      await refreshSettings();
      setSuccessMessage('Website settings saved and applied across public pages.');
    } catch (err) {
      setError(err.message || 'Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center">
        <Loader2 size={26} className="animate-spin text-[#e50914]" />
      </div>
    );
  }

  const inputClasses =
    'mt-1.5 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#e50914] focus:outline-none';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
          Website Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Configure global contact info, showreel media, social links, and SEO
          metadata.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-[#e50914]/45 bg-[#e50914]/15 p-3.5 text-xs text-red-200">
          <AlertCircle size={15} className="mt-0.5 shrink-0 text-[#ff303b]" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3.5 text-xs text-emerald-200">
          <CheckCircle2
            size={15}
            className="mt-0.5 shrink-0 text-emerald-400"
          />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Info */}
        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-[#171717] p-6">
          <h2 className="text-base font-semibold text-white">
            Contact Details
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
                Contact Email
              </label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, contactEmail: e.target.value }))
                }
                placeholder="hello@example.com"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
                Phone Number
              </label>
              <input
                type="text"
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
                }
                placeholder="+1 000 000 0000"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder="Working Worldwide (Remote)"
                className={inputClasses}
              />
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-[#171717] p-6">
          <h2 className="text-base font-semibold text-white">Social Links</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
                Instagram URL
              </label>
              <input
                type="url"
                value={form.instagramUrl}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, instagramUrl: e.target.value }))
                }
                placeholder="https://instagram.com/..."
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
                YouTube URL
              </label>
              <input
                type="url"
                value={form.youtubeUrl}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, youtubeUrl: e.target.value }))
                }
                placeholder="https://youtube.com/..."
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={form.linkedinUrl}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, linkedinUrl: e.target.value }))
                }
                placeholder="https://linkedin.com/in/..."
                className={inputClasses}
              />
            </div>
          </div>
        </section>

        {/* Showreel Media */}
        <section className="space-y-5 rounded-2xl border border-zinc-800 bg-[#171717] p-6">
          <h2 className="text-base font-semibold text-white">Showreel Media</h2>
          <CloudinaryUploadField
            label="Showreel Video URL"
            resourceType="video"
            folder="ronak-portfolio/showreel"
            value={form.showreelVideoUrl}
            onChange={(val) =>
              setForm((prev) => ({ ...prev, showreelVideoUrl: val }))
            }
          />
          <CloudinaryUploadField
            label="Showreel Thumbnail URL"
            resourceType="image"
            folder="ronak-portfolio/showreel"
            value={form.showreelThumbnailUrl}
            onChange={(val) =>
              setForm((prev) => ({ ...prev, showreelThumbnailUrl: val }))
            }
          />
        </section>

        {/* SEO & Footer */}
        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-[#171717] p-6">
          <h2 className="text-base font-semibold text-white">
            SEO &amp; Footer Metadata
          </h2>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
              Website SEO Title
            </label>
            <input
              type="text"
              value={form.seoTitle}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, seoTitle: e.target.value }))
              }
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
              Meta Description
            </label>
            <textarea
              rows={2}
              value={form.metaDescription}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  metaDescription: e.target.value,
                }))
              }
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
              Copyright Text
            </label>
            <input
              type="text"
              value={form.copyrightText}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, copyrightText: e.target.value }))
              }
              className={inputClasses}
            />
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#e50914] px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_-4px_rgba(229,9,20,0.65)] transition-colors hover:bg-[#b20710] disabled:opacity-60"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
