import type { GameDatabase } from "@/lib/types";
import { sampleDatabase } from "@/data/sample-database";
import importedData from "../../data/imported/gamewith-current-items.json";

const importedDatabase = importedData as Partial<GameDatabase>;

export const mergedDatabase: GameDatabase = {
  ...sampleDatabase,
  equipment: [
    ...sampleDatabase.equipment,
    ...(importedDatabase.equipment ?? []),
  ],
  hearts: [...sampleDatabase.hearts, ...(importedDatabase.hearts ?? [])],
  monsters: [
    ...sampleDatabase.monsters,
    ...(importedDatabase.monsters ?? []),
  ],
  skills: [...sampleDatabase.skills, ...(importedDatabase.skills ?? [])],
  jobs: {
    ...sampleDatabase.jobs,
    ...(importedDatabase.jobs ?? {}),
  },
};
