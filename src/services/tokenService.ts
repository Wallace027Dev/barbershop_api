import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export class TokenService {
  static generateToken(payload: object, expiresIn = "1d"): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
  }

  static verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
  }
}
