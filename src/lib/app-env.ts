export type AppEnvironment = "sandbox" | "production";

export function getAppEnvironment(): AppEnvironment {
  return process.env.APP_ENV === "sandbox" ? "sandbox" : "production";
}

export function isSandboxEnvironment() {
  return getAppEnvironment() === "sandbox";
}

export function isProductionEnvironment() {
  return getAppEnvironment() === "production";
}
