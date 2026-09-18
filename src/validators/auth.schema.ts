import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),

  email: z.string().email("Format email tidak valid"),

  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),

  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token wajib diisi"),

  password: z.string().min(8, "Password minimal 8 karakter"),
});
