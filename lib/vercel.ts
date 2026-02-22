

export const isVercelDomain = (host: string | null) => {
  if (!host) return false;
  // Splits "my-app.vercel.app" into ["my-app", "vercel", "app"]
  const parts = host.split('.');
  return parts.includes('vercel');
};