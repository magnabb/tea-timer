import React, { useState } from 'react';

const PROMPT_TEXT = `Act as a tea master. I have this tea:

[INSERT TEA NAME AND/OR SHOP LINK HERE]

Please research this tea or similar teas of this type. Generate a gong-fu brewing configuration string for it.

Format rules:
- Rinse: \`(seconds)\` e.g. \`(10)\`
- Range: \`min-max\` e.g. \`20-30\`
- Fixed: \`seconds\` e.g. \`20\`
- Separator: \` -> \`

Example: \`(10) -> 15-20 -> 20-25 -> 30\`

Requirements:
- Include rinse if typical for this tea.
- Provide 8-10 steeps.
- Output ONLY the configuration string as a code snippet.`;

export const CopyPromptButton: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PROMPT_TEXT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="btn-glass-dark"
      style={{
        fontSize: '0.9rem',
        padding: '0.4rem 0.8rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginLeft: 'auto' // Push to the right if in a flex container
      }}
      aria-label="Copy ChatGPT Prompt"
    >
      {copied ? (
        <>
          <span>✓</span> Copied!
        </>
      ) : (
        <>
          <span>🤖</span> Copy AI Prompt
        </>
      )}
    </button>
  );
};
