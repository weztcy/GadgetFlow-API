import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET belum dikonfigurasi");
}

export interface JwtPayload {
  id: number;

  email: string;

  role: string;
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(
    payload,

    JWT_SECRET,

    {
      expiresIn: "15m",

      algorithm: "HS256",
    },
  );
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(
    token,

    JWT_SECRET,

    {
      algorithms: ["HS256"],
    },
  );

  if (typeof decoded !== "object" || decoded === null) {
    throw new Error("Invalid JWT payload");
  }

  return decoded as JwtPayload;
}
