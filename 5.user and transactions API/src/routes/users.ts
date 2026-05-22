import { FastifyInstance } from 'fastify';
import { IHeaders, IQuerystring, IReply } from "../models/fastify.js";
import { CreateUser, CreateUserType } from '../models/users.js';

export function registerUserRoutes(server: FastifyInstance): void {
  server.post<{
    Querystring: IQuerystring,
    Headers: IHeaders,
    Body: CreateUserType,
    Reply: CreateUserType | IReply['4xx']
  }>('/auth', 
    {
    schema: {
      body: CreateUser,
      response: {
        200: CreateUser
      },
    },
  },
  (request, reply) => {
    const { name, email } = request.body;
    reply.status(200).send({ name, email });
  });
}