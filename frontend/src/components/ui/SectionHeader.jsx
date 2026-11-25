const SectionHeader = ({
  eyebrow,
  title,
  highlightedText,
  subtitle,
  align = 'left',
  action = null,
}) => {
  const isCentered = align === 'center';

  return (
    <div
      className={`flex flex-col gap-5 ${
        isCentered
          ? 'items-center text-center'
          : 'md:flex-row md:items-end md:justify-between'
      }`}
    >
      <div className={isCentered ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && (
          <div
            className={`mb-3 inline-flex items-center gap-3 font-mono-label text-xs uppercase tracking-[0.22em] text-accent-soft ${
              isCentered ? 'justify-center' : ''
            }`}
          >
            <span className="h-px w-6 bg-accent" aria-hidden="true" />
            <span>{eyebrow}</span>
          </div>
        )}

        <h2 className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          {title}{' '}
          {highlightedText && (
            <span className="text-gradient-purple">{highlightedText}</span>
          )}
        </h2>

        {subtitle && (
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export default SectionHeader;
