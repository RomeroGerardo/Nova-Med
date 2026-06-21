import { cn } from '@/lib/utils'

interface LogoProps {
  /** Show the text wordmark next to the icon */
  showWordmark?: boolean
  /** Show the "Business Solutions" tagline */
  showTagline?: boolean
  /** Overall size of the icon mark in px */
  size?: number
  /** Invert colors for use on dark/colored backgrounds */
  inverted?: boolean
  className?: string
}

/**
 * NovaMed Logo — SVG puro, sin dependencias de imagen.
 * Combinación de cruz médica + línea ECG en verde salud.
 */
export function Logo({
  showWordmark = true,
  showTagline = false,
  size = 36,
  inverted = false,
  className,
}: LogoProps) {
  const wordmarkColor = inverted ? 'text-white' : 'text-foreground'
  const accentColor = inverted ? 'text-white/80' : 'text-primary'

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* ── Icon Mark ── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="NovaMed logo icon"
        role="img"
        style={{ flexShrink: 0 }}
      >
        {/* Background */}
        <rect
          width="100"
          height="100"
          rx="22"
          fill={inverted ? 'rgba(255,255,255,0.20)' : '#004aad'}
        />
        {/* Inner glow */}
        <rect
          width="100"
          height="100"
          rx="22"
          fill="url(#nm-glow)"
          opacity="0.35"
        />

        {/* Medical Cross — vertical */}
        <rect x="42" y="16" width="16" height="68" rx="8" fill="white" opacity="0.95" />
        {/* Medical Cross — horizontal */}
        <rect x="16" y="42" width="68" height="16" rx="8" fill="white" opacity="0.95" />

        {/* ECG / Pulse line */}
        <path
          d="M10 50 H28 L34 28 L43 72 L52 28 L61 72 L67 50 H90"
          stroke="#7ed957"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Corner accent dots */}
        <circle cx="13" cy="13" r="3" fill="#7ed957" opacity="0.45" />
        <circle cx="87" cy="87" r="3" fill="#7ed957" opacity="0.45" />

        <defs>
          <radialGradient id="nm-glow" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="100%" stopColor="#001945" stopOpacity="1" />
          </radialGradient>
        </defs>
      </svg>

      {/* ── Wordmark ── */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-0">
            <span
              className={cn(
                'font-bold tracking-tight',
                wordmarkColor,
              )}
              style={{ fontSize: size * 0.56 }}
            >
              Nova
            </span>
            <span
              className={cn('font-bold tracking-tight', accentColor)}
              style={{ fontSize: size * 0.56 }}
            >
              Med
            </span>
          </div>

          {showTagline && (
            <span
              className={cn(
                'font-semibold uppercase tracking-[0.18em] mt-0.5',
                inverted ? 'text-white/50' : 'text-muted-foreground',
              )}
              style={{ fontSize: size * 0.21 }}
            >
              Business Solutions
            </span>
          )}
        </div>
      )}
    </div>
  )
}
