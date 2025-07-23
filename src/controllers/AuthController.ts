import { Request, Response } from "express";
import { db } from "../../prisma/db";
import jwt from "jsonwebtoken";
import http from "../utils/http";
import { UserRepository } from "../repositories/UserRepository";
import { validateCreateUserSchema } from "../schemas/UserSchema";
import { IUser } from "../interfaces/IUser";

interface TokenResponse {
  token: string;
}

export class AuthController {
  static async login(
    req: Request,
    res: Response
  ): Promise<Response<TokenResponse>> {
    const { email, password } = req.body;
    if (!email || !password) {
      return http.badRequest(res, "Email and password are required");
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return http.unauthorized(res, "Invalid email or password");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
    UserRepository.update({ ...user, token });

    return http.ok(res, "Login successful", { token } as TokenResponse);
  }

  static async register(req: Request, res: Response): Promise<Response<TokenResponse>> {
    const body = req.body as IUser;

    const { success, data, error } = validateCreateUserSchema(body);
    if (!success || !data) {
      return http.badRequest(res, "Invalid data", error);
    }

    const userExists = await UserRepository.findByEmail(data.email);
    if (userExists) {
      return http.conflict(res, "User already exists");
    }

    const user = await UserRepository.create(data);
    return http.created(res, "User created", { token: user.token });
  }
}
