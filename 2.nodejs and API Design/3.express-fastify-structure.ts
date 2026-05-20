// Express/Fastify project structure example
// This is a simple example of how to structure an Express or Fastify project in TypeScript.

// We will have a src directory where we will put all our source code.
// Inside the src directory, we will have a controllers directory where we will put all our controllers,
// a services directory where we will put all our services,
// and a routes directory where we will put all our routes.
// We will also have an index.ts file where we will set up our server and import all our routes.

// src/index.ts
import express from "express";
import routes from "./routes";
const app = express();
app.use(express.json());
app.use("/api", routes);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// src/routes/index.ts
import { Router } from "express";
import userRoutes from "./userRoutes";
const router = Router();
router.use("/users", userRoutes);
export default router;

// src/routes/userRoutes.ts
import { Router } from "express";
import { getUsers, createUser } from "../controllers/userController";
const router = Router();
router.get("/", getUsers);
router.post("/", createUser);
export default router;  

// src/controllers/userController.ts
import { Request, Response } from "express";
import { UserService } from "../services/userService";
const userService = new UserService();
export const getUsers = (req: Request, res: Response) => {
  const users = userService.getUsers();
  res.json(users);
};
export const createUser = (req: Request, res: Response) => {
  const user = userService.createUser(req.body);
  res.status(201).json(user);
};

// src/services/userService.ts  
interface User {
  id: number;
  name: string;
  email: string;
}
class UserService {
  private users: User[] = []
    getUsers(): User[] {
    return this.users;
  }
    createUser(userData: Omit<User, "id">): User {
    const newUser: User = {
      id: this.users.length + 1,
      ...userData,
    };
    this.users.push(newUser);
    return newUser;
  }
}

export { UserService };


// We need to take into consideration when building an API or a server, to use caching to improve performance,
// and to use a database to store and retrieve data. 
// We can use an in-memory database like Redis for caching, and a relational database like PostgreSQL or MySQL for persistent storage. 
// We can also use an ORM (Object-Relational Mapping) library like TypeORM or Sequelize to interact with the database in a more convenient way.

// We should also implement rate limiting to prevent abuse of our API, and we can use a library like express-rate-limit for that.
// We want to check db bottlenecks and optimize our queries to ensure 
// that our API can handle a high volume of requests without crashing.

// Finally, we should also consider using a testing framework like Jest to write unit tests and integration tests for our API to ensure that it works as expected and to catch any bugs early on.

