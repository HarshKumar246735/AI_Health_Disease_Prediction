// Turns any axios/network error into a short, friendly message. Raw backend errors are never shown.
export function friendlyError(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback;
  if (error.code === 'ERR_NETWORK' || !error.response) {
    return "We couldn't reach the server. Check your connection and try again.";
  }
  const { status, data } = error.response;
  if (status === 401) return data?.message || 'Your session has expired. Please sign in again.';
  if (status === 403) return "You don't have access to this page.";
  if (status === 404) return "We couldn't find what you were looking for.";
  if (status === 429) return 'Too many attempts. Please wait a moment and try again.';
  if (status === 503) return "We couldn't complete the assessment right now. Please try again.";
  if (status >= 500) return 'Our server had a problem. Please try again shortly.';
  // 4xx messages written by our own API (validation etc.) are safe to show
  return typeof data?.message === 'string' ? data.message : fallback;
}
