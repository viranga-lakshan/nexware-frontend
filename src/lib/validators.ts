import { z } from "zod";

/** Matches backend UUID strings; Zod's built-in `.uuid()` rejects demo seed ids. */
export const entityId = (message = "Required") =>
  z
    .string()
    .min(1, message)
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, message);
