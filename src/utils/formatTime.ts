/**
 * Formats seconds into a human-readable time string.
 * For times >= 60 seconds, returns MM:SS format (e.g., "1:05" for 65 seconds).
 * For times < 60 seconds, returns the original string.
 */
export const formatTime = (seconds: number): string => {
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return seconds.toString();
};

/**
 * Formats a stage's original text to display time in human-readable format.
 * Handles both range (e.g., "25-30") and fixed (e.g., "60") formats.
 */
export const formatStageText = (originalText: string): string => {
  // Check for range format (e.g., "25-30" or "25–30")
  const rangeMatch = originalText.match(/^(\d+)\s*([-–])\s*(\d+)$/);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1], 10);
    const max = parseInt(rangeMatch[3], 10);
    const separator = rangeMatch[2];
    return `${formatTime(min)}${separator}${formatTime(max)}`;
  }

  // Check for fixed format (e.g., "60")
  const fixedMatch = originalText.match(/^(\d+)$/);
  if (fixedMatch) {
    const seconds = parseInt(fixedMatch[1], 10);
    return formatTime(seconds);
  }

  // Return original text if no match (shouldn't happen in normal cases)
  return originalText;
};
