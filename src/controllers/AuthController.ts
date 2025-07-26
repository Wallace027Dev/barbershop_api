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
      return http.badRequest(res, "Email e senha são obrigatórios");
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return http.unauthorized(
        res,
        "Credenciais inválidas. Verifique suas credenciais"
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return http.unauthorized(
        res,
        "Credenciais inválidas. Verifique suas credenciais"
      );
    }

    const token = TokenService.generateToken({
      email: user.email,
      role: user.role,
    });

    const updatedUser = await UserRepository.update({ ...user, token });

    return http.ok(res, "Login realizado com sucesso", { token: updatedUser.token });
  }

  static async register(
    req: Request,
    res: Response
  ): Promise<Response<TokenResponse>> {
    const body = req.body as IUserBase;

    const { success, error } = validateCreateUserSchema(body);
    if (!success) {
      return http.badRequest(res, "Dados inválidos", error);
    }

    const userExists = await UserRepository.findByEmail(body.email);
    if (userExists) {
      return http.conflict(res, "Usuário com esse email já cadastrado");
    }

    const passwordHash = await bcrypt.hash(
      body.password,
      Number(process.env.BCRYPT_SALT_ROUNDS)
    );
    const token = TokenService.generateToken({
      email: body.email,
      role: body.role,
    });

    const newUser = { ...body, token, password: passwordHash } as IUserBase;
    const createdUser = await UserRepository.create(newUser);

    return http.created(res, "Usuário criado", { token: createdUser.token });
  }
}
