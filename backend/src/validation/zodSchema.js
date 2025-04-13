import zod from "zod";

export const signUpBodyChecker = zod.object({
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string().min(6),
  username: zod.string().email(),
});

export const signInBodyChecker = zod.object({
  username: zod.string().email(),
  password: zod.string().min(6),
});

export const updateUserBodyChecker = zod.object({
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
  password: zod.string().min(6).optional(),
});

export const transferMoneyCheck = zod.object({
  to: zod.string(),
  amount: zod.number(),
});
