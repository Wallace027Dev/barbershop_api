import { Response } from "express";

function ok(
  res: Response,
  message = "Success",
  data: Record<string, any> = {}
): Response {
  return res.status(200).json({ message, ...data });
}

function created(
  res: Response,
  message = "Resource created",
  data: Record<string, any> = {}
): Response {
  return res.status(201).json({ message, ...data });
}

function badRequest(
  res: Response,
  message = "Bad request",
  data: Record<string, any> = {}
): Response {
  return res.status(400).json({ message, ...data });
}

function unauthorized(
  res: Response,
  message = "Unauthorized",
  data: Record<string, any> = {}
): Response {
  return res.status(401).json({ message, ...data });
}

function forbidden(
  res: Response,
  message = "Forbidden",
  data: Record<string, any> = {}
): Response {
  return res.status(403).json({ message, ...data });
}

function notFound(
  res: Response,
  message = "Not found",
  data: Record<string, any> = {}
): Response {
  return res.status(404).json({ message, ...data });
}

function conflict(
  res: Response,
  message = "Conflict",
  data: Record<string, any> = {}
): Response {
  return res.status(409).json({ message, ...data });
}

export default {
  ok,
  created,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
};
