// Shared environment helpers for edge functions.
// Centralizes production safety checks for payment-critical variables.

export function getEnvironment(): string {
  return Deno.env.get('ENVIRONMENT') || 'development';
}

export function isProductionEnvironment(): boolean {
  return getEnvironment() === 'production';
}

export function getRequiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getOptionalEnv(name: string, fallback = ''): string {
  return Deno.env.get(name) || fallback;
}

export function assertRequiredEnv(names: string[]): void {
  const missing = names.filter((name) => !Deno.env.get(name));
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
