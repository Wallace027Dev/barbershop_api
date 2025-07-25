import "dotenv/config";
import http from "../utils/http";
import bcrypt from "bcryptjs";
import { db } from "../../prisma/db";
import { Request, Response } from "express";
import { validateCreateUserSchema } from "../schemas/UserSchema";
import { UserRepository } from "../repositories/UserRepository";
import { TokenService } from "../services/tokenService";
import { IUserBase } from "../interfaces/IUser";

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
    if (!user) {
      return http.unauthorized(
        res,
        "Invalid credentials. Verify your credentials"
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return http.unauthorized(
        res,
        "Invalid credentials. Verify your credentials"
      );
    }

    const token = TokenService.generateToken({
      email: user.email,
      role: user.role,
    });

    const updatedUser = await UserRepository.update({ ...user, token });

    return http.ok(res, "Login successful", { token: updatedUser.token });
  }

  static async register(
    req: Request,
    res: Response
  ): Promise<Response<TokenResponse>> {
    const body = req.body as IUserBase;

    const { success, error } = validateCreateUserSchema(body);
    if (!success) {
      return http.badRequest(res, "Invalid data", error);
    }

    const userExists = await UserRepository.findByEmail(body.email);
    if (userExists) {
      return http.conflict(res, "User already exists");
    }

    const passwordHash = await bcrypt.hash(body.password, 10);
    const token = TokenService.generateToken({
      email: body.email,
      role: body.role,
    });

    const newUser = { ...body, token, password: passwordHash } as IUserBase;
    const createdUser = await UserRepository.create(newUser);

    return http.created(res, "User created", { token: createdUser.token });
  }
}
