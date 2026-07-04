export function SiteBackdrop() {
  return (
    <div className="site-backdrop" aria-hidden="true">
      <div className="site-backdrop__aurora site-backdrop__aurora--amber" />
      <div className="site-backdrop__aurora site-backdrop__aurora--meadow" />
      <div className="site-backdrop__hex-field site-backdrop__hex-field--left" />
      <div className="site-backdrop__hex-field site-backdrop__hex-field--right" />

      <div className="site-backdrop__story site-backdrop__story--hero">
        <svg viewBox="0 0 520 420" className="site-backdrop__art site-backdrop__art--hero" role="presentation">
          <defs>
            <linearGradient id="hiveGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,236,176,0.95)" />
              <stop offset="100%" stopColor="rgba(242,181,68,0.38)" />
            </linearGradient>
            <linearGradient id="petalGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,253,247,0.92)" />
              <stop offset="100%" stopColor="rgba(255,194,108,0.3)" />
            </linearGradient>
          </defs>
          <g className="site-backdrop__drift site-backdrop__drift--slow">
            <path
              d="M320 55l46 27v53l-46 27-46-27V82l46-27Zm0 16-31 18v39l31 18 31-18V89l-31-18Z"
              fill="url(#hiveGlow)"
            />
            <path
              d="M390 118l34 20v39l-34 20-34-20v-39l34-20Zm0 12-23 13v28l23 13 23-13v-28l-23-13Z"
              fill="url(#hiveGlow)"
            />
            <path
              d="M247 126l30 18v35l-30 18-31-18v-35l31-18Zm0 10-21 12v25l21 12 21-12v-25l-21-12Z"
              fill="url(#hiveGlow)"
            />
          </g>
          <g className="site-backdrop__drift site-backdrop__drift--bee">
            <ellipse cx="155" cy="210" rx="26" ry="16" fill="rgba(35,33,21,0.9)" />
            <ellipse cx="137" cy="210" rx="7" ry="6" fill="rgba(22,21,16,0.92)" />
            <rect x="148" y="196" width="6" height="28" rx="3" fill="rgba(255,188,52,0.95)" />
            <rect x="159" y="196" width="6" height="28" rx="3" fill="rgba(255,188,52,0.95)" />
            <ellipse cx="163" cy="193" rx="19" ry="12" fill="rgba(211,240,250,0.5)" transform="rotate(-20 163 193)" />
            <ellipse cx="163" cy="227" rx="18" ry="10" fill="rgba(211,240,250,0.34)" transform="rotate(16 163 227)" />
            <path d="M132 206c-14-14-22-23-33-32" stroke="rgba(49,57,44,0.72)" strokeWidth="4" strokeLinecap="round" />
            <path d="M130 214c-14 14-20 23-31 31" stroke="rgba(49,57,44,0.72)" strokeWidth="4" strokeLinecap="round" />
          </g>
          <g className="site-backdrop__drift site-backdrop__drift--medium">
            <path d="M42 323c38-52 64-71 116-83 26 16 46 44 58 83H42Z" fill="rgba(57,90,66,0.12)" />
            <path d="M86 240c7 27 7 50 2 83" stroke="rgba(72,110,77,0.36)" strokeWidth="5" strokeLinecap="round" />
            <path d="M116 232c7 30 6 57-1 91" stroke="rgba(72,110,77,0.3)" strokeWidth="4" strokeLinecap="round" />
            <path d="M106 238c-26-14-42-10-57 14 27 2 43-4 57-14Z" fill="url(#petalGlow)" />
            <path d="M117 261c-22 12-30 28-29 49 22-11 32-27 29-49Z" fill="rgba(255,211,135,0.34)" />
            <path d="M118 233c28-8 46-2 62 22-29 0-47-7-62-22Z" fill="url(#petalGlow)" />
            <path d="M115 263c27 4 42 17 52 42-27-4-43-17-52-42Z" fill="rgba(255,211,135,0.28)" />
          </g>
        </svg>
      </div>

      <div className="site-backdrop__story site-backdrop__story--meadow">
        <svg viewBox="0 0 560 460" className="site-backdrop__art site-backdrop__art--meadow" role="presentation">
          <defs>
            <linearGradient id="sunAmber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,233,171,0.95)" />
              <stop offset="100%" stopColor="rgba(244,161,45,0.24)" />
            </linearGradient>
            <linearGradient id="leafGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(214,247,201,0.58)" />
              <stop offset="100%" stopColor="rgba(118,166,101,0.18)" />
            </linearGradient>
          </defs>
          <g className="site-backdrop__drift site-backdrop__drift--slow">
            <circle cx="428" cy="84" r="58" fill="url(#sunAmber)" />
            <path d="M475 286c-18-39-39-65-71-89-35 17-59 44-79 89h150Z" fill="rgba(122,164,103,0.1)" />
            <path d="M412 205c8 33 6 62-3 111" stroke="rgba(83,121,81,0.28)" strokeWidth="6" strokeLinecap="round" />
            <path d="M447 196c8 33 7 66-2 121" stroke="rgba(83,121,81,0.28)" strokeWidth="5" strokeLinecap="round" />
            <path d="M405 208c-30-14-46-11-66 17 31 4 49-1 66-17Z" fill="url(#leafGlow)" />
            <path d="M451 195c33-10 53-2 76 23-34 2-56-6-76-23Z" fill="url(#leafGlow)" />
            <path d="M406 248c30 7 48 23 61 55-31-7-49-24-61-55Z" fill="rgba(255,210,132,0.24)" />
          </g>
          <g className="site-backdrop__drift site-backdrop__drift--bee-fast">
            <ellipse cx="223" cy="175" rx="22" ry="14" fill="rgba(35,33,21,0.88)" />
            <ellipse cx="206" cy="175" rx="6" ry="5" fill="rgba(22,21,16,0.92)" />
            <rect x="216" y="163" width="5" height="24" rx="2.5" fill="rgba(255,188,52,0.95)" />
            <rect x="226" y="163" width="5" height="24" rx="2.5" fill="rgba(255,188,52,0.95)" />
            <ellipse cx="229" cy="157" rx="18" ry="10" fill="rgba(211,240,250,0.48)" transform="rotate(-24 229 157)" />
            <ellipse cx="228" cy="191" rx="17" ry="9" fill="rgba(211,240,250,0.34)" transform="rotate(18 228 191)" />
            <path d="M191 171c-24-10-39-17-62-20" stroke="rgba(244,181,62,0.22)" strokeWidth="3" strokeDasharray="8 12" strokeLinecap="round" />
          </g>
          <g className="site-backdrop__drift site-backdrop__drift--medium">
            <path
              d="M108 250l39 23v46l-39 23-39-23v-46l39-23Zm0 14-27 15v33l27 15 27-15v-33l-27-15Z"
              fill="rgba(255,224,149,0.58)"
            />
            <path
              d="M165 216l27 15v31l-27 15-27-15v-31l27-15Zm0 10-18 10v21l18 10 18-10v-21l-18-10Z"
              fill="rgba(255,224,149,0.42)"
            />
            <path
              d="M166 279l24 14v27l-24 14-24-14v-27l24-14Zm0 9-16 9v18l16 9 16-9v-18l-16-9Z"
              fill="rgba(255,224,149,0.34)"
            />
          </g>
        </svg>
      </div>

      <div className="site-backdrop__grain" />
    </div>
  );
}
