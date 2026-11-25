import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { SERVICES_DATA } from '../../data/servicesData';

const INITIAL_FORM_STATE = {
  fullName: '',
  email: '',
  projectType: '',
  budget: '',
  message: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Reusable Contact Form component.
 * In Phase 2, validates fields and simulates submission states locally.
 * Ready to accept an async API handler in Phase 3.
 */
const ContactForm = ({ initialProjectType = '' }) => {
  const [formData, setFormData] = useState({
    ...INITIAL_FORM_STATE,
    projectType: initialProjectType,
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    if (initialProjectType) {
      setFormData((prev) => ({ ...prev, projectType: initialProjectType }));
    }
  }, [initialProjectType]);

  const validate = () => {
    const nextErrors = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Please enter your full name.';
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Please enter your email address.';
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.projectType.trim()) {
      nextErrors.projectType = 'Please select a project type.';
    }

    if (!formData.message.trim()) {
      nextErrors.message = 'Please share a brief overview of your project.';
    } else if (formData.message.trim().length < 10) {
      nextErrors.message = 'Message should be at least 10 characters.';
    }

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (status === 'success' || status === 'error') {
      setStatus('idle');
      setFeedbackMessage('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus('error');
      setFeedbackMessage('Please fix the highlighted fields before submitting.');
      return;
    }

    setStatus('loading');
    setFeedbackMessage('');

    // Phase 2 UI simulation only (backend API integration happens in Phase 3)
    await new Promise((resolve) => setTimeout(resolve, 700));

    setStatus('success');
    setFeedbackMessage(
      'Preview submission validated! Backend enquiry delivery will be connected in Phase 3.'
    );
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
  };

  const inputBaseClasses =
    'mt-1.5 w-full rounded-xl border bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent';

  return (
    <div className="relative rounded-3xl bg-paper p-6 text-slate-900 shadow-[0_24px_60px_-15px_rgba(178,7,16,0.34)] sm:p-8 lg:p-10">
      {/* Accent Ribbon */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <span className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-deep">
          Project Brief
        </span>
        <span className="-rotate-2 rounded-md bg-accent-deep px-3 py-1 font-mono-label text-[10px] font-semibold uppercase tracking-[0.15em] text-white shadow-sm">
          Phase 2 UI Ready
        </span>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block font-mono-label text-xs font-semibold uppercase tracking-[0.14em] text-slate-800"
          >
            Full Name <span className="text-accent-deep">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            aria-invalid={Boolean(errors.fullName)}
            className={`${inputBaseClasses} ${
              errors.fullName ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs font-medium text-red-600">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block font-mono-label text-xs font-semibold uppercase tracking-[0.14em] text-slate-800"
          >
            Email <span className="text-accent-deep">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.example"
            aria-invalid={Boolean(errors.email)}
            className={`${inputBaseClasses} ${
              errors.email ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs font-medium text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        {/* Project Type + Budget */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="projectType"
              className="block font-mono-label text-xs font-semibold uppercase tracking-[0.14em] text-slate-800"
            >
              Project Type <span className="text-accent-deep">*</span>
            </label>
            <select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              aria-invalid={Boolean(errors.projectType)}
              className={`${inputBaseClasses} ${
                errors.projectType ? 'border-red-500' : 'border-slate-300'
              }`}
            >
              <option value="">Select a service...</option>
              {SERVICES_DATA.map((service) => (
                <option key={service.id} value={service.title}>
                  {service.title}
                </option>
              ))}
              <option value="Other / Custom Project">Other / Custom Project</option>
            </select>
            {errors.projectType && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {errors.projectType}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="budget"
              className="block font-mono-label text-xs font-semibold uppercase tracking-[0.14em] text-slate-800"
            >
              Budget <span className="text-slate-500">(Optional)</span>
            </label>
            <input
              id="budget"
              name="budget"
              type="text"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Optional budget range"
              className={`${inputBaseClasses} border-slate-300`}
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block font-mono-label text-xs font-semibold uppercase tracking-[0.14em] text-slate-800"
          >
            Message <span className="text-accent-deep">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell Ronak about your video style, timeline, and goals..."
            aria-invalid={Boolean(errors.message)}
            className={`${inputBaseClasses} resize-y ${
              errors.message ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {errors.message && (
            <p className="mt-1 text-xs font-medium text-red-600">
              {errors.message}
            </p>
          )}
        </div>

        {/* Status Alert */}
        {status === 'success' && (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-xl border border-emerald-300 bg-emerald-50 p-3.5 text-xs font-medium text-emerald-900"
          >
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-700" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {status === 'error' && feedbackMessage && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-red-300 bg-red-50 p-3.5 text-xs font-medium text-red-900"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-700" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-accent-glow inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === 'loading' ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Sending Brief...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Send Enquiry</span>
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-600">
          Form UI preview — Phase 3 will connect submissions directly to the
          backend API.
        </p>
      </form>
    </div>
  );
};

export default ContactForm;
