import "dotenv/config";
import type { SignatureKey } from "hono/utils/jwt/jws";
import { getSafeEnvironmentVar } from "../utils/utils.js";

const JWT_SECRET = getSafeEnvironmentVar("JWT_SECRET");

export default JWT_SECRET as SignatureKey;
