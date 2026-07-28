import fs from "node:fs";
import path from "node:path";
import type { GameDatabase } from "@/lib/types";
import { sampleDatabase } from "@/data/sample-database";

const IMPORT_DIR = path.join(process.cwd(), "data", "imported");

export function loadGameDatabase(): GameDatabase {
  const merged: GameDatabase = structuredClone(sampleDatabase);

  if (!fs.existsSync(IMPORT_DIR)) {
    return merged;
  }

  const files = fs.readdirSync(IMPORT_DIR).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const raw = fs.readFileSync(path.join(IMPORT_DIR, file), "utf-8");
    const data = JSON.parse(raw) as Partial<GameDatabase>;

    if (data.equipment?.length) {
      merged.equipment.push(...data.equipment);
    }
    if (data.hearts?.length) {
      merged.hearts.push(...data.hearts);
    }
    if (data.monsters?.length) {
      merged.monsters.push(...data.monsters);
    }
    if (data.skills?.length) {
      merged.skills.push(...data.skills);
    }
    if (data.jobs) {
      merged.jobs = { ...merged.jobs, ...data.jobs };
    }
  }

  return merged;
}
