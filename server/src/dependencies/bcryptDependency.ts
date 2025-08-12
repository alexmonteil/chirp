import { safeParse } from "../utils/utils.js";
import { saltRoundsSchema } from "../validation/saltRounds.js";

export const HASH_SALT_ROUNDS = safeParse<number>(
  saltRoundsSchema,
  process.env.HASH_SALT_ROUNDS,
  10
);
