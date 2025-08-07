import "dotenv/config";
import type { SignatureKey } from "hono/utils/jwt/jws";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

export default JWT_SECRET as SignatureKey;
