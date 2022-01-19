import { generateSnapshot } from "../../lib/src/snapshot";
import { AirdropType } from "../../lib/src/types";

async function main() {
  await generateSnapshot(AirdropType.Huxlxy);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
