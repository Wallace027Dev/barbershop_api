import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import http from "../utils/http";
import { IUser } from "../interfaces/IUser";

export class UserController {
  static async getAllUsers(
    req: Request,
    res: Response
  ): Promise<Response<IUser[]>> {
    const params = req.params;
    const users = await UserRepository.findAll(params);

    if (users.length === 0) return http.notFound(res, "Users not found");

    return http.ok(res, users);
  }

  static async getUserById(
    req: Request,
    res: Response
  ): Promise<Response<IUser>> {
    const id = req.params.id;
    if (!id) return http.badRequest(res, "Id is required");

    const user = await UserRepository.findById(id);
    if (!user) return http.notFound(res, "User not found");

    return http.ok(res, user);
  }
}
