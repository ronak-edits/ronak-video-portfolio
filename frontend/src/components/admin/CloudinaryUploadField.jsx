import { useRef, useState } from 'react';
import {
  AlertCircle,
  Film,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Upload,
} from 'lucide-react';
import { uploadMediaToCloudinary } from '../../services/portfolioService';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const MAX_IMAGE_MB = 10;
const MAX_VIDEO_MB = 200;

const CloudinaryUploadField = ({
  label,
  value = '',
  onChange,
  resourceType = 'image',
  folder = 'ronak-portfolio/thumbnails',
  placeholder = 'https://res.cloudinary.com/...',
  helperText = '',
}) => {
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const isVideo = resourceType === 'video';
  const acceptAttr = isVideo
    ? 'video/mp4,video/webm,video/quicktime'
    : 'image/jpeg,image/png,image/webp';

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setError('');

    const allowed = isVideo ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES;
    const maxMb = isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB;

    if (!allowed.includes(file.type.toLowerCase())) {
      setError(
        `Invalid file type. Allowed: ${isVideo ? 'MP4, WebM, MOV' : 'JPG, PNG, WebP'}.`
      );
      return;
    }

    if (file.size > maxMb * 1024 * 1024) {
      setError(`File exceeds maximum size of ${maxMb} MB.`);
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const result = await uploadMediaToCloudinary({
        file,
        resourceType,
        folder,
        onProgress: setProgress,
      });
      onChange(result.secureUrl, result);
    } catch (err) {
      setError(
        err.message ||
          'Upload failed. Ensure Cloudinary environment variables are configured.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
          {label}
        </label>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="url"
          value={value}
          onChange={(e) => {
            setError('');
            onChange(e.target.value);
          }}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-zinc-800 bg-[#0a0a0a] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#e50914] focus:outline-none"
        />

        <input
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#e50914]/40 bg-[#e50914]/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#e50914] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>{progress}%</span>
              </>
            ) : (
              <>
                <Upload size={14} />
                <span>Upload {isVideo ? 'Video' : 'Image'}</span>
              </>
            )}
          </button>

          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              aria-label={`Clear ${label || 'media URL'}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-[#111111] text-zinc-400 transition-colors hover:border-[#e50914]/50 hover:text-white"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {helperText && <p className="text-xs text-zinc-500">{helperText}</p>}

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-[#e50914]/40 bg-[#e50914]/10 p-2.5 text-xs text-red-200">
          <AlertCircle size={14} className="mt-0.5 shrink-0 text-[#ff303b]" />
          <span>{error}</span>
        </div>
      )}

      {/* Preview Box */}
      {value && !isVideo && (
        <div className="mt-2 flex items-center gap-3 rounded-xl border border-zinc-800 bg-[#111111] p-2.5">
          <img
            src={value}
            alt="Uploaded media preview"
            className="h-14 w-24 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
              <ImageIcon size={13} className="text-[#e50914]" />
              <span>Image Preview</span>
            </p>
            <p className="truncate text-[11px] text-zinc-500">{value}</p>
          </div>
        </div>
      )}

      {value && isVideo && (
        <div className="mt-2 flex items-center gap-3 rounded-xl border border-zinc-800 bg-[#111111] p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e50914]/15 text-[#ff303b]">
            <Film size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-zinc-200">Video URL Attached</p>
            <p className="truncate text-[11px] text-zinc-500">{value}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudinaryUploadField;
