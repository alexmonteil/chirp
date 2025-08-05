import { type ZodType } from "zod";

export function safeParse<T>(
  schema: ZodType<T>,
  data: unknown,
  fallbackValue: T
): T {
  const result = schema.safeParse(data);
  let expectedData: T;
  if (result.success) {
    return result.data;
  } else {
    console.error("Zod validation failed:", result.error.issues);
    return fallbackValue;
  }
}
