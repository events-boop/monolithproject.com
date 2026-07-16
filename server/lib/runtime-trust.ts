const NETLIFY_PRODUCTION_CONTEXTS = new Set([
  "production",
  "deploy-preview",
  "branch-deploy",
]);

export function isProductionRuntime() {
  const netlifyContext = process.env.CONTEXT?.trim().toLowerCase();

  return (
    process.env.NODE_ENV?.trim().toLowerCase() === "production" ||
    process.env.NETLIFY?.trim().toLowerCase() === "true" ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME?.trim()) ||
    Boolean(netlifyContext && NETLIFY_PRODUCTION_CONTEXTS.has(netlifyContext))
  );
}

export function shouldTrustForwardedHeaders() {
  const explicit = process.env.TRUST_PROXY_HEADERS?.trim().toLowerCase();

  if (explicit === "true") return true;
  if (explicit === "false") return false;

  return process.env.NETLIFY === "true";
}
