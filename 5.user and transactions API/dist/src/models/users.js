import { Type } from 'typebox';
export const User = Type.Object({
    id: Type.Number(),
    name: Type.String(),
    email: Type.String({ format: 'email' }),
    createdAt: Type.String({ format: 'date-time' })
});
export const CreateUser = Type.Omit(User, ['id', 'createdAt']);
//# sourceMappingURL=users.js.map