/* eslint-disable @typescript-eslint/no-unused-vars */
import type { User, UserProfile, UserFullProfile, UserTransaction } from './types.mjs';
import { getAllUserProfiles, getAllUsers, getAllUserTransactions } from './utils/data.mjs';
import { logger } from './utils/logger.mjs';

export function task(store: Awaited<ReturnType<typeof getStore>>) {
    // TODO: Leave one of the store method calls uncommented (when the method is implemented and run the code.

    for (const user of store.users) {
        // logger.log(`Profile for user ${user.id}`, store.getUserProfile(user.id));
        // logger.log(`Transactions for user ${user.id}`, store.getUserTransactions(user.id).length);
        // logger.log(`Account balance for user ${user.id}`, store.getUserAccountBalance(user.id));
        // logger.log(`Full profile for user ${user.id}`, store.getUserFullProfile(user.id));
    }

    // logger.log(`User with largest account balance`, store.getUserWithLargestAccountBalance());
    // logger.log(`User with smallest account balance`, store.getUserWithSmallestAccountBalance());
    // logger.log(`User with smallest positive account balance`, store.getUserWithSmallestPositiveAccountBalance());
    logger.log(`User with largest negative account balance`, store.getUserWithLargestNegativeAccountBalance());
}

export async function getStore() {
    // Use data from the following variables to implement the methods below
    const users: Readonly<User[]> = await getAllUsers();
    const userProfiles: Readonly<UserProfile[]> = await new Promise<UserProfile[]>((resolve) =>
        getAllUserProfiles(resolve),
    );
    const userTransactions: Readonly<UserTransaction[]> = await new Promise<UserTransaction[]>((resolve) =>
        getAllUserTransactions(resolve),
    );

    // IF WE could stop scanning arrays repeteadly, we could use maps with an index:

    const usersById = new Map(users.map(u => [u.id, u]));
    const profilesByUserId = new Map(userProfiles.map(p => [p.userId, p]));
    const transactionsByUserId = new Map<string, UserTransaction[]>();

    for (const t of userTransactions) {
        if (!transactionsByUserId.has(t.userId)) {
        transactionsByUserId.set(t.userId, []);
        }
    transactionsByUserId.get(t.userId)!.push(t);
    }

    // You can create additional variables to transform the data into different structures or formats if needed.

    // Task 1
    const getUserProfile = (userId: string): Omit<UserProfile, 'userId'> | null => {
        const userProfile = userProfiles.find((profile) => userId === profile.userId);
        if (!userProfile){
            return null
        }
        const { userId: _, ...rest } = userProfile
        // we don't use delete here because it mutates the original object, and we want to keep it immutable.
    
        return rest

        // Complexity is O(n)
    };

    // Task 2
    const getUserTransactions = (userId: string): Omit<UserTransaction, 'userId'>[] => {
        const transactions = userTransactions.filter((trans) => trans.userId === userId)
                                             .map((trans) => {
                                                    const { userId: _, ...rest } = trans
                                                    return rest
        });
        return transactions;
        // Complexity is 0(n) but with two passes. 
        // If it became critical, we could solve it with one pass with a for ..of loop

        const transactionsForUser: Omit<UserTransaction, 'userId'>[] = [];
        for (const transaction of userTransactions) {
            if (transaction.userId === userId) {
                const { userId: _, ...rest } = transaction;
                transactionsForUser.push(rest);
            }
        }
        return transactionsForUser;
    };

    // Task 3
    const getUserAccountBalance = (userId: string): number => {
        let balance = 0;
        for (const transaction of userTransactions) {
            if (transaction.userId === userId) {
                balance += transaction.amount;
            }
        } 
        return balance;

        // Complexity is 0(n).
        // Could also be done with a reduce function
        const balanceWithReduce = userTransactions.reduce((acc, transaction) => {
            if (transaction.userId === userId) {
                return acc + transaction.amount;
            }
            return acc;
        }, 0);

        return balanceWithReduce;
    };

    // Task 4
    const getUserFullProfile = (
        userId: string,
    ): UserFullProfile | null => {
        /*
        let accountBalance = 0;
        const userProfile = userProfiles.find((profile) => userId === profile.userId);
        const user = users.find((u) => userId === u.id);
         if (!userProfile || !user){
            return null
        }
        for (const transaction of userTransactions) {
            if (transaction.userId === userId) {
                accountBalance += transaction.amount;
            }
        } 
        const { userId: _, ...restOfProfile } = userProfile;

        return {
            ...user,
            ...restOfProfile,
            accountBalance
        }*/
        // Complexity is 0(n) but runs 3 times. If it's heavy read, we could have indexes.
        const user = usersById.get(userId);
        const userProfile = profilesByUserId.get(userId);
        const transactions = transactionsByUserId.get(userId);

        if (!user || !userProfile) {
            return null;
        }

        let accountBalance = 0;

        if (transactions) {
            for (const t of transactions) {
            accountBalance += t.amount;
            }
        }

        const { userId: _, ...profileWithoutUserId } = userProfile;

        return {
            ...user,
            ...profileWithoutUserId,
            accountBalance,
        };
    };

    // Task 5
    const getUserWithLargestAccountBalance = (): { accountBalance: number; userId: string | null } => {
        // array method wouldn't be optimal because we would have to calculate the balance for each user every time, which would be O(n^2) in the worst case.
        // the solution for the array method would be:
        // let largestBalance = -Infinity;
        // let largestBalanceUserId: string | null = null;
        // for (const user of users) {  
        //     const balance = getUserAccountBalance(user.id); // this is O(n), checking all transactions and we do it for each user, so O(n^2)
        //     if (balance > largestBalance) {
        //         largestBalance = balance;  xccccccccccccccccccccccccccccccccccccccccccccccccccc                
        //         largestBalanceUserId = user.id;
        //     }
        // }
        // return {
        //     accountBalance: largestBalance,
        //     userId: largestBalanceUserId,
        // };
        const balancesByUserId = new Map<string, number>();

        for (const transaction of userTransactions) {
            const currentBalance = balancesByUserId.get(transaction.userId) ?? 0;

            balancesByUserId.set(
                transaction.userId,
                currentBalance + transaction.amount
            );
        }

        let largestBalance = -Infinity;
        let largestBalanceUserId: string | null = null;

        for (const [userId, balance] of balancesByUserId) {
            if (balance > largestBalance) {
            largestBalance = balance;
            largestBalanceUserId = userId;
            }
        }

        return {
            accountBalance: largestBalance,
            userId: largestBalanceUserId,
        };
    };

    // Task 6
    const getUserWithSmallestAccountBalance = (): { accountBalance: number; userId: string | null } => {
        const balancesByUserId = new Map<string, number>();

        for (const transaction of userTransactions) {
            const currentBalance = balancesByUserId.get(transaction.userId) ?? 0;

            balancesByUserId.set(
                transaction.userId,
                currentBalance + transaction.amount
            );
        }

        let lowestBalance = Infinity;
        let lowestBalanceUserId: string | null = null;

        for (const [userId, balance] of balancesByUserId) {
            if (balance < lowestBalance) {
            lowestBalance = balance;
            lowestBalanceUserId = userId;
            }
        }

        return {
            accountBalance: lowestBalance,
            userId: lowestBalanceUserId,
        };
    };

    // An optimization would be to have the map creation and the map populating inside the getStore, so we only perform it once.

    // Task 7
    const getUserWithSmallestPositiveAccountBalance = (): { accountBalance: number; userId: string | null } => {
        const balancesByUserId = new Map<string, number>();

        for (const transaction of userTransactions) {
            const currentBalance = balancesByUserId.get(transaction.userId) ?? 0;

            balancesByUserId.set(
                transaction.userId,
                currentBalance + transaction.amount
            );
        }

        let lowestPositiveBalance = Infinity;
        let lowestPositiveBalanceUserId: string | null = null;

        for (const [userId, balance] of balancesByUserId) {
            if (balance < lowestPositiveBalance && balance > 0) {
            lowestPositiveBalance = balance;
            lowestPositiveBalanceUserId = userId;
            }
        }

        return {
            accountBalance:
                lowestPositiveBalance === Infinity
                ? 0
                : lowestPositiveBalance,
            userId: lowestPositiveBalanceUserId,
        };

        // If there are no positive account balances, returning lowestPositiveBalance can return Infinity,
        // That is why we do the ternary and return 0, userId will be null.
    };

    // Task 8
    const getUserWithLargestNegativeAccountBalance = (): { accountBalance: number; userId: string | null } => {
        const balancesByUserId = new Map<string, number>();

        for (const transaction of userTransactions) {
            const currentBalance = balancesByUserId.get(transaction.userId) ?? 0;

            balancesByUserId.set(
                transaction.userId,
                currentBalance + transaction.amount
            );
        }

        let largestNegativeBalance = -Infinity;
        let largestNegativeBalanceUserId: string | null = null;

        for (const [userId, balance] of balancesByUserId) {
            if (balance > largestNegativeBalance && balance < 0) {
            largestNegativeBalance = balance;
            largestNegativeBalanceUserId = userId;
            }
        }

        return {
            accountBalance:
                largestNegativeBalance === -Infinity
                ? 0
                : largestNegativeBalance,
            userId: largestNegativeBalanceUserId,
        };

        // If there are no negative account balances, returning largestNegativeBalance can return -Infinity,
        // That is why we do the ternary and return 0, userId will be null.
    };

    return {
        users,
        getUserProfile,
        getUserTransactions,
        getUserAccountBalance,
        getUserFullProfile,
        getUserWithLargestAccountBalance,
        getUserWithSmallestAccountBalance,
        getUserWithSmallestPositiveAccountBalance,
        getUserWithLargestNegativeAccountBalance,
    };
}
