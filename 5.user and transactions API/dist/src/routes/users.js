import { CreateUser } from '../models/users.js';
export function registerUserRoutes(server) {
    server.post('/auth', {
        schema: {
            body: CreateUser,
            response: {
                200: CreateUser
            },
        },
    }, (request, reply) => {
        const { name, email } = request.body;
        reply.status(200).send({ name, email });
    });
}
//# sourceMappingURL=users.js.map