import { Static, Type } from 'typebox';

export const User = Type.Object({
    id: Type.Number(),
    name: Type.String(),
    email: Type.String({ format: 'email' }),
    createdAt: Type.String({ format: 'date-time' })
})

export type UserType = Static<typeof User>;

export const CreateUser = Type.Omit(User, ['id', 'createdAt']);
export type CreateUserType = Static<typeof CreateUser>;