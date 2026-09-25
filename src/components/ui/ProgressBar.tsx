interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
}

export function ProgressBar({ progress, color = 'var(--color-accent)' }: ProgressBarProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '4px',
        backgroundColor: 'var(--color-accent-soft)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: color,
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  );
}

export default ProgressBar;