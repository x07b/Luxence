/**
 * Environment Variable Validator
 * PostgreSQL-based validation
 */

export interface EnvConfig {
  required: string[];
  optional: string[];
  requiredForProduction: string[];
}

const ENV_CONFIG: EnvConfig = {
  required: ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"],
  requiredForProduction: ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"],
  optional: ["NODE_ENV", "ADMIN_EMAIL", "PING_MESSAGE", "PORT", "SENDER_EMAIL"],
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

  if (process.env.SMTP_PORT && Number.isNaN(Number(process.env.SMTP_PORT))) {
    errors.push("SMTP_PORT must be a valid number");
  }

  if (
    process.env.ADMIN_EMAIL &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.ADMIN_EMAIL)
  ) {
    warnings.push("ADMIN_EMAIL does not appear to be a valid email address");
  }

  if (
    process.env.SENDER_EMAIL &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.SENDER_EMAIL)
  ) {
    warnings.push("SENDER_EMAIL does not appear to be a valid email address");
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
    hasSmtpHost: !!process.env.SMTP_HOST,
    hasSmtpPort: !!process.env.SMTP_PORT,
    hasSmtpUser: !!process.env.SMTP_USER,
    hasSmtpPass: !!process.env.SMTP_PASS,
    adminEmail: process.env.ADMIN_EMAIL || "not set",
    senderEmail: process.env.SENDER_EMAIL || "not set",
  };
}