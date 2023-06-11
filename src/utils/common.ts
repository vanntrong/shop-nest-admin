/**
 * Checks whether the current runtime is a browser
 */
export const isBrowser = (): boolean => typeof window !== 'undefined';

/**
 * Format currency
 */
// export const formatCurrency = (amount: number, symbol?: string) => {
//   const value = String(amount).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,');
//   if (symbol) return `${value} ${symbol}`;
//   return value;
// };
