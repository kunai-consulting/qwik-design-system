export function generateSymbolName(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Convert to a positive hex string and take first 11 chars
  return "s_" +Math.abs(hash).toString(16).padStart(11, '0').substring(0, 11);
}