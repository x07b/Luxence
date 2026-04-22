/**
 * Environment Variable Validator
 * PostgreSQL-based validation after removing Supabase
 */

export interface EnvConfig {
  required: string[];
  optional: string[];
  requiredForProduction: string[];
}

const ENV_CONFIG: EnvConfig = {
  required: ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"],
  requiredForProduction: ["RESEND_API_KEY"],
  optional: ["NODE_ENV", "ADMIN_EMAIL", "PING_MESSAGE", "PORT"],
};

export function validateEnv(): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const isProd = process.env.NODE_ENV === "production";

  ENV_CONFIG.required.forEach((varName) => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  });

  if (isProd) {
    ENV_CONFIG.requiredForProduction.forEach((varName) => {
      if (!process.env[varName]) {
        warnings.push(
          `Missing ${varName} in production mode. Email features will not work.`,
        );
      }
    });
  }

  if (process.env.DB_PORT && Number.isNaN(Number(process.env.DB_PORT))) {
    errors.push("DB_PORT must be a valid number");
  }

  if (
    process.env.ADMIN_EMAIL &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.ADMIN_EMAIL)
  ) {
    warnings.push("ADMIN_EMAIL does not appear to be a valid email address");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function logValidationResults(
  validation: ReturnType<typeof validateEnv>,
) {
  if (validation.errors.length > 0) {
    console.error("❌ Configuration errors:");
    validation.errors.forEach((err) => console.error(`   - ${err}`));
  }

  if (validation.warnings.length > 0) {
    console.warn("⚠️  Configuration warnings:");
    validation.warnings.forEach((warn) => console.warn(`   - ${warn}`));
  }

  if (validation.valid && validation.warnings.length === 0) {
    console.log("✅ Environment configuration valid");
  }
}

export function assertValidEnv() {
  const validation = validateEnv();
  logValidationResults(validation);

  if (!validation.valid) {
    throw new Error(
      `Invalid environment configuration. ${validation.errors.length} error(s) found. See logs above.`,
    );
  }
}

export function getEnvSummary() {
  return {
    nodeEnv: process.env.NODE_ENV || "not set",
    hasDbHost: !!process.env.DB_HOST,
    hasDbPort: !!process.env.DB_PORT,
    hasDbName: !!process.env.DB_NAME,
    hasDbUser: !!process.env.DB_USER,
    hasDbPassword: !!process.env.DB_PASSWORD,
    hasResendKey: !!process.env.RESEND_API_KEY,
    adminEmail: process.env.ADMIN_EMAIL || "not set",
  };
}
