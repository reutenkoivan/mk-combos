export const webBasePath = "/mk-combos/" as const;

// Route paths live in the URL fragment. The outer GitHub Pages path remains
// `webBasePath` and is not part of TanStack Router's logical location.
export const webRouterBasePath = "/" as const;
