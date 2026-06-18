import "dotenv/config";

import { backfillLegacyTrainingApplications } from "@/lib/training-application-store";

async function main() {
  await backfillLegacyTrainingApplications();
  console.log("Legacy training applications backfilled successfully.");
}

main().catch((error) => {
  console.error("Backfill failed.", error);
  process.exit(1);
});
