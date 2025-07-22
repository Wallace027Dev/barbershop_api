import z from "zod";

export function parseSchema<T>(schema: z.ZodType<T>, data: unknown) {
  const result = schema.safeParse(data);
  return {
    success: result.success,
    data: result.success ? result.data : undefined,
    error: result.error?.issues,
  };
}