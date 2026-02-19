import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
  currentUserName: string;
};

function getConfigFilePath(): string {
  console.log(path.join(os.homedir(), ".gatorconfig.json"));
  return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
  const raw = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };
  fs.writeFileSync(getConfigFilePath(), JSON.stringify(raw, null, 2));
}

function validateConfig(rawConfig: any): Config {
  if (typeof rawConfig !== "object" || rawConfig === null) {
    throw new Error("Invalid config: expected an object");
  }
  if (typeof rawConfig.db_url !== "string") {
    throw new Error("Invalid config: missing or invalid db_url");
  }
  return {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name || "",
  };
}

export function readConfig(): Config {
  const filePath = getConfigFilePath();
  const data = fs.readFileSync(filePath, "utf-8");
  const rawConfig = JSON.parse(data);
  return validateConfig(rawConfig);
}

export function setUser(name: string): Config {
  const cfg = readConfig();
  cfg.currentUserName = name;
  writeConfig(cfg);
  return cfg;
}
