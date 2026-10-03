// Raw-only canonical intake. Independent AUDIENCE_DATABASE_URL never uses legacy website tables.
import { createNeonIntakeFunction } from "../../server/audience-signup/receiver/neon-intake-function.mjs";
export const handler = createNeonIntakeFunction();
