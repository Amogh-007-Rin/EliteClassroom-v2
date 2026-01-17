import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request body", issues: parsed.error.issues });
    }
    req.body = parsed.data as unknown as Request["body"];
    next();
  };

