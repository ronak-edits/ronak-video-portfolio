import { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { fetchProfile, updateProfile } from '../../services/portfolioService';
import CloudinaryUploadField from '../../components/admin/CloudinaryUploadField';

const INITIAL_PROFILE = {
  name: 'Ronak',
  professionalTitle: 'Video Editor & Visual Storyteller',
  profileImage: '',
  shortBio: '',
  fullBiography: '',
  creativeApproach: '',
  experience: [],
  editingSkills: [],
  softwareTools: [],
  socialUrls: {
    youtube: '',
    instagram: '',
    linkedin: '',
    twitter: '',
  },
};

const AdminProfile = () => {
  const [form, setForm] = useState(INITIAL_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let active = true;
    fetchProfile()
      .then((profile) => {
        if (!active) return;
        setForm({
          name: profile.name || 'Ronak',
          professionalTitle: profile.professionalTitle || '',
          profileImage: profile.profileImage || '',
          shortBio: profile.shortBio || '',
          fullBiography: profile.fullBiography || '',
          creativeApproach: profile.creativeApproach || '',
          experience: Array.isArray(profile.experience) ? profile.experience : [],
          editingSkills: Array.isArray(profile.editingSkills)
            ? profile.editingSkills
            : [],
          softwareTools: Array.isArray(profile.softwareTools)
            ? profile.softwareTools
            : [],
          socialUrls: {
            youtube: profile.socialUrls?.youtube || '',
            instagram: profile.socialUrls?.instagram || '',
            linkedin: profile.socialUrls?.linkedin || '',
            twitter: profile.socialUrls?.twitter || '',
          },
        });
      })
      .catch((err) => {
        if (active) setError(err.message || 'Failed to load profile.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const updateArrayItem = (arrayKey, index, field, value) => {
    setForm((prev) => ({
      ...prev,
      [arrayKey]: prev[arrayKey].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addArrayItem = (arrayKey, template) => {
    setForm((prev) => ({
      ...prev,
      [arrayKey]: [...prev[arrayKey], template],
    }));
  };

  const removeArrayItem = (arrayKey, index) => {
    setForm((prev) => ({
      ...prev,
      [arrayKey]: prev[arrayKey].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!form.name.trim()) {
      setError('Profile name is required.');
      return;
    }

    setIsSaving(true);
    try {
      const updated = await updateProfile(form);
      setForm((prev) => ({ ...prev, ...updated }));
      setSuccessMessage('Profile saved to MongoDB and synced with About page.');
    } catch (err) {
      setError(err.message || 'Failed to save profile.');
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
          Profile / About Me
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage biography, experience, skills, tools, and portrait displayed on
          the public About page.
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
        {/* Identity */}
        <section className="space-y-5 rounded-2xl border border-zinc-800 bg-[#171717] p-6">
          <h2 className="text-base font-semibold text-white">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
                Name <span className="text-[#ff303b]">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className={inputClasses}
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
                Professional Title
              </label>
              <input
                type="text"
                value={form.professionalTitle}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    professionalTitle: e.target.value,
                  }))
                }
                placeholder="Video Editor & Colorist"
                className={inputClasses}
              />
            </div>
          </div>

          <CloudinaryUploadField
            label="Profile Image"
            resourceType="image"
            folder="ronak-portfolio/profile"
            value={form.profileImage}
            onChange={(val) =>
              setForm((prev) => ({ ...prev, profileImage: val }))
            }
          />

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
              Short Bio / Introduction
            </label>
            <textarea
              rows={2}
              value={form.shortBio}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, shortBio: e.target.value }))
              }
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
              Full Biography
            </label>
            <textarea
              rows={5}
              value={form.fullBiography}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, fullBiography: e.target.value }))
              }
              placeholder="Separate paragraphs with a blank line"
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
              Creative Approach
            </label>
            <textarea
              rows={3}
              value={form.creativeApproach}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  creativeApproach: e.target.value,
                }))
              }
              className={inputClasses}
            />
          </div>
        </section>

        {/* Experience */}
        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-[#171717] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Experience</h2>
            <button
              type="button"
              onClick={() =>
                addArrayItem('experience', {
                  period: '',
                  role: '',
                  company: '',
                  summary: '',
                })
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-[#111111] px-3 py-1.5 text-xs font-medium text-white hover:border-[#e50914]"
            >
              <Plus size={14} />
              <span>Add Experience</span>
            </button>
          </div>

          {form.experience.map((item, idx) => (
            <div
              key={idx}
              className="space-y-3 rounded-xl border border-zinc-800 bg-[#111111] p-4"
            >
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeArrayItem('experience', idx)}
                  aria-label="Remove experience item"
                  className="text-zinc-500 hover:text-[#ff303b]"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <input
                  type="text"
                  placeholder="Period (e.g. 2023 – Present)"
                  value={item.period}
                  onChange={(e) =>
                    updateArrayItem('experience', idx, 'period', e.target.value)
                  }
                  className={inputClasses}
                />
                <input
                  type="text"
                  placeholder="Role / Title"
                  value={item.role}
                  onChange={(e) =>
                    updateArrayItem('experience', idx, 'role', e.target.value)
                  }
                  className={inputClasses}
                />
                <input
                  type="text"
                  placeholder="Company / Context"
                  value={item.company}
                  onChange={(e) =>
                    updateArrayItem('experience', idx, 'company', e.target.value)
                  }
                  className={inputClasses}
                />
              </div>
              <textarea
                rows={2}
                placeholder="Summary"
                value={item.summary}
                onChange={(e) =>
                  updateArrayItem('experience', idx, 'summary', e.target.value)
                }
                className={inputClasses}
              />
            </div>
          ))}
        </section>

        {/* Editing Skills & Software Tools */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="space-y-4 rounded-2xl border border-zinc-800 bg-[#171717] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">
                Editing Skills
              </h2>
              <button
                type="button"
                onClick={() =>
                  addArrayItem('editingSkills', { title: '', detail: '' })
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-[#111111] px-3 py-1.5 text-xs font-medium text-white hover:border-[#e50914]"
              >
                <Plus size={14} />
                <span>Add Skill</span>
              </button>
            </div>

            {form.editingSkills.map((skill, idx) => (
              <div
                key={idx}
                className="space-y-2 rounded-xl border border-zinc-800 bg-[#111111] p-4"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Skill title"
                    value={skill.title}
                    onChange={(e) =>
                      updateArrayItem(
                        'editingSkills',
                        idx,
                        'title',
                        e.target.value
                      )
                    }
                    className={inputClasses}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('editingSkills', idx)}
                    aria-label="Remove skill"
                    className="mt-1.5 text-zinc-500 hover:text-[#ff303b]"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Brief detail"
                  value={skill.detail}
                  onChange={(e) =>
                    updateArrayItem(
                      'editingSkills',
                      idx,
                      'detail',
                      e.target.value
                    )
                  }
                  className={inputClasses}
                />
              </div>
            ))}
          </section>

          <section className="space-y-4 rounded-2xl border border-zinc-800 bg-[#171717] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">
                Software / Tools
              </h2>
              <button
                type="button"
                onClick={() =>
                  addArrayItem('softwareTools', { name: '', category: '' })
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-[#111111] px-3 py-1.5 text-xs font-medium text-white hover:border-[#e50914]"
              >
                <Plus size={14} />
                <span>Add Tool</span>
              </button>
            </div>

            {form.softwareTools.map((tool, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#111111] p-3"
              >
                <input
                  type="text"
                  placeholder="Tool name (e.g. Premiere Pro)"
                  value={tool.name}
                  onChange={(e) =>
                    updateArrayItem('softwareTools', idx, 'name', e.target.value)
                  }
                  className={inputClasses}
                />
                <input
                  type="text"
                  placeholder="Category (e.g. NLE)"
                  value={tool.category}
                  onChange={(e) =>
                    updateArrayItem(
                      'softwareTools',
                      idx,
                      'category',
                      e.target.value
                    )
                  }
                  className={inputClasses}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('softwareTools', idx)}
                  aria-label="Remove tool"
                  className="mt-1.5 text-zinc-500 hover:text-[#ff303b]"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </section>
        </div>

        {/* Social URLs */}
        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-[#171717] p-6">
          <h2 className="text-base font-semibold text-white">
            Social Media URLs
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {['youtube', 'instagram', 'linkedin', 'twitter'].map((network) => (
              <div key={network}>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
                  {network}
                </label>
                <input
                  type="url"
                  value={form.socialUrls[network]}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      socialUrls: {
                        ...prev.socialUrls,
                        [network]: e.target.value,
                      },
                    }))
                  }
                  placeholder={`https://${network}.com/...`}
                  className={inputClasses}
                />
              </div>
            ))}
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
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
