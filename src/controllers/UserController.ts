import http from "../utils/http";
import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { IUser, IUserBase } from "../interfaces/IUser";
import { cleanUserQueryParams } from "../helpers/cleanUserQueryParams";

export class UserController {
  static async getAllUsers(
    req: Request,
    res: Response
  ): Promise<Response<IUser[]>> {
    const params = req.query as Partial<IUserBase>;

    const dataParams = cleanUserQueryParams(params);
    if ("error" in dataParams) return http.badRequest(res, dataParams.error);

    const users = await UserRepository.findAll(dataParams);
    if (users.length === 0) return http.notFound(res, "Nenhum usuário encontrado");

    const usersWithoutPassword = users.map((user: IUser) => ({
      ...user,
      password: undefined
    }));

    return http.ok(res, "Usuários encontrados", usersWithoutPassword);
  }

  static async getUserById(
    req: Request,
    res: Response
  ): Promise<Response<IUser>> {
    const id = req.params.id;
    if (!id) return http.badRequest(res, "Id é obrigatório");

    const user = await UserRepository.findById(id);
    if (!user) return http.notFound(res, "Usuário não encontrado");

    const { password, ...userWithoutPassword } = user;

    return http.ok(res, "Usuário encontrado", userWithoutPassword);
  }
}
