import 'dotenv/config';

export const getEnvVar = (name, defaultValue) => {
  const value = process.env[name];
  if (value !== undefined) return value;
  if (defaultValue !== undefined) return defaultValue;
  throw new Error(`Missing: process.env['${name}']`);
};
