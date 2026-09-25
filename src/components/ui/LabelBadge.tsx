import { LABEL_TOKENS } from '../../data/labels';
import type { LabelName } from '../../types/board.types';

interface LabelBadgeProps {
  label: LabelName;
}

export function LabelBadge({ label }: LabelBadgeProps) {
  const styles = LABEL_TOKENS[label] || LABEL_TOKENS.Undefined;

  return (
    <span
      style={{
        backgroundColor: styles.bg,
        color: styles.text,
        borderRadius: '4px',
        padding: '2px 8px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.3px',
      }}
    >
      {label}
    </span>
  );
}

export default LabelBadge;