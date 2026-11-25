import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { SERVICES_DATA } from '../../data/servicesData';
import {
  fetchPublicServices,
  submitPublicEnquiry,
} from '../../services/portfolioService';

const INITIAL_FORM_STATE = {
  fullName: '',
  email: '',
  projectType: '',
  budget: '',
  message: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactForm = ({ initialProjectType = '' }) => {
  const [formData, setFormData] = useState({
    ...INITIAL_FORM_STATE,
    projectType: initialProjectType,
  });
  const [serviceOptions, setServiceOptions] = useState(
    SERVICES_DATA.map((s) => s.title)
  );
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    if (initialProjectType) {
      setFormData((prev) => ({ ...prev, projectType: initialProjectType }));
    }
  }, [initialProjectType]);

  useEffect(() => {
    let active = true;
    fetchPublicServices()
      .then((services) => {
        if (active && services.length > 0) {
          setServiceOptions(services.map((s) => s.title));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

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

    try {
      const response = await submitPublicEnquiry({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        projectType: formData.projectType.trim(),
        budget: formData.budget.trim(),
        message: formData.message.trim(),
      });

      setStatus('success');
      setFeedbackMessage(
        response?.message ||
          'Thank you! Your enquiry has been sent successfully.'
      );
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
    } catch (err) {
      setStatus('error');
      setFeedbackMessage(
        err.message || 'Unable to send enquiry. Please try again.'
      );
    }
  };

  const inputBaseClasses =
    'mt-1.5 w-full rounded-xl border bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent';

  return (
    <div className="relative rounded-3xl bg-paper p-6 text-slate-900 shadow-[0_24px_60px_-15px_rgba(178,7,16,0.34)] sm:p-8 lg:p-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <span className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-deep">
          Project Brief
        </span>
        <span className="-rotate-2 rounded-md bg-accent-deep px-3 py-1 font-mono-label text-[10px] font-semibold uppercase tracking-[0.15em] text-white shadow-sm">
          Direct Enquiry
        </span>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
              {serviceOptions.map((title) => (
                <option key={title} value={title}>
                  {title}
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
      </form>
    </div>
  );
};

export default ContactForm;
