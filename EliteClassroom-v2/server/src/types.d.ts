import "express";

declare global {
  namespace Express {
    interface UserPayload {
      id: number;
      role: string;
      email: string;
    }
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};

