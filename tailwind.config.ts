import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-2": "var(--color-surface-2)",
        border: "var(--color-border)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        "muted-2": "var(--color-muted-2)",
        accent: "var(--color-accent)",
        "accent-2": "var(--color-accent-2)",
        "accent-soft": "var(--color-accent-soft)",
        danger: "var(--color-danger)",
        "danger-soft": "var(--color-danger-soft)",
        warn: "var(--color-warn)",
        "warn-soft": "var(--color-warn-soft)",
        success: "var(--color-success)",
        "label-feature-bg": "var(--label-feature-bg)",
        "label-feature-text": "var(--label-feature-text)",
        "label-bug-bg": "var(--label-bug-bg)",
        "label-bug-text": "var(--label-bug-text)",
        "label-issue-bg": "var(--label-issue-bg)",
        "label-issue-text": "var(--label-issue-text)",
        "label-undefined-bg": "var(--label-undefined-bg)",
        "label-undefined-text": "var(--label-undefined-text)",
      },
      borderRadius: {
        "lg-token": "var(--radius-lg)",
        "md-token": "var(--radius-md)",
        "sm-token": "var(--radius-sm)",
      },
      boxShadow: {
        "card": "var(--shadow-card)",
        "pop": "var(--shadow-pop)",
      },
      fontSize: {
        "badge": "11px",
        "meta": ["12px", { lineHeight: "1.5" }],
        "body": ["13px", { lineHeight: "1.5" }],
        "brand": "15px",
        "modal-title": "19px",
      },
      fontFamily: {
        sans: "var(--font-family)",
      },
      letterSpacing: {
        "tighter": "var(--letter-spacing)",
      }
    },
  },
} satisfies Config