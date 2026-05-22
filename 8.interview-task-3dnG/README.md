# interview-task-3dnG

## After cloning the repository
### If you don't have NodeJS installed
- Install `nvm` (Node Version Manager) https://github.com/nvm-sh/nvm
- Install NodeJS using `nvm`:
  - `nvm install 22.20.0`
  - `nvm use 22.20.0`
  - Verify `node` is installed
    - `node -v`
- Install `pnpm` (Performant Node Package Manager) https://pnpm.io/installation#using-npm
  - `npm install -g pnpm@9.5.0`
  - Verify `pnpm` is installed
    - `pnpm -v`
-   Install packages
    - `pnpm install`

## Task Description

There is a store object factory in `./src/todo.mts` which has the following methods that need to be implemented:

-   `getUserProfile` - Find and return user profile for a given user ID
-   `getUserTransactions` - Find and return all user transactions for a given user ID
-   `getUserAccountBalance` - Calculate and return account balance (sum of all transactions) for a given user ID
-   `getUserFullProfile` - Find and return complete user profile including account balance
-   `getUserWithLargestAccountBalance` - Find user with the highest account balance
-   `getUserWithSmallestAccountBalance` - Find user with the lowest account balance
-   `getUserWithSmallestPositiveAccountBalance` - Find user with the smallest positive balance
-   `getUserWithLargestNegativeAccountBalance` - Find user with the largest negative balance

## Implementation Guidelines

Your task is to implement all of these methods. The `./src/todo.mts` file is the only file you should modify as part of this task.

### Available Data
The store has the following variables with data in scope that you should source from:
- `users` - Array of user objects with id and username
- `userProfiles` - Array of user profile objects with detailed information
- `userTransactions` - Array of user transaction objects with amounts and types

You can create additional variables to transform the data into different structures or formats if needed. **Do not change** the definitions or data in the aforementioned variables unless the task description explicitly asks you to do so.

### Testing and Benchmarking
Inside `./src/todo.mts` you will find a `task` function that receives the store object. To test your implementation:

1. After implementing the `getUserProfile` method, comment out its call and uncomment the next method call
2. Continue this process for each method implementation
3. This approach allows benchmarking the execution time of each method separately

**Note**: Make sure your return types match the function signatures exactly as defined in the code.