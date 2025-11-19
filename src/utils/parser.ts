export type StageType = 'range' | 'fixed';

export interface Stage {
  type: StageType;
  min?: number;
  max?: number;
  duration?: number;
  originalText: string;
  isRinse?: boolean;
}

export const parseConfig = (configStr: string): Stage[] => {
  if (!configStr) return [];

  const stages: Stage[] = [];
  
  // Regex to find groups in parentheses or single items
  // This splits by -> but respects parentheses
  // Actually, simpler approach: split by -> then clean up?
  // No, (3-5 -> 5-7) contains -> inside.
  
  // Let's iterate through the string manually or use a smarter regex.
  // Given the format is simple, we can split by `->` only if not inside `()`.
  
  let currentToken = '';
  let depth = 0;
  
  const pushToken = (token: string) => {
    const trimmed = token.trim();
    if (!trimmed) return;
    
    // Check if it's a group
    if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
      const inner = trimmed.slice(1, -1);
      const innerParts = inner.split(/->|→/).map(s => s.trim());
      innerParts.forEach(part => {
        stages.push({ ...parsePart(part), isRinse: true });
      });
    } else {
      stages.push(parsePart(trimmed));
    }
  };

  for (let i = 0; i < configStr.length; i++) {
    const char = configStr[i];
    if (char === '(') depth++;
    if (char === ')') depth--;
    
    if (depth === 0 && (configStr.substring(i, i + 2) === '->' || configStr[i] === '→')) {
      pushToken(currentToken);
      currentToken = '';
      if (configStr[i] === '→') {
        // single char
      } else {
        i++; // skip >
      }
    } else {
      currentToken += char;
    }
  }
  pushToken(currentToken);

  return stages;
};

const parsePart = (part: string): Stage => {
  // Check for range (e.g., 25-30, 25–30)
  const rangeMatch = part.match(/^(\d+)\s*[-–]\s*(\d+)$/);

  if (rangeMatch) {
    const min = parseInt(rangeMatch[1], 10);
    const max = parseInt(rangeMatch[2], 10);
    return {
      type: 'range',
      min,
      max,
      originalText: part,
    };
  }

  // Check for fixed (e.g., 60)
  const fixedMatch = part.match(/^(\d+)$/);
  if (fixedMatch) {
    const duration = parseInt(fixedMatch[1], 10);
    return {
      type: 'fixed',
      duration,
      originalText: part,
    };
  }

  throw new Error(`Invalid stage format: ${part}`);
};
