// #####################################
// # DONT CHANGE ANYTHING IN THIS FILE #
// #####################################

export interface User {
    id: string;
    username: string;
}

export interface UserProfile {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    country: string;
    city: string;
    address: string;
    postalCode: string;
}

export interface UserTransaction {
    userId: string;
    amount: number;
    type: 'credit' | 'debit';
}

export type UserFullProfile = User & Omit<UserProfile, 'userId'> & {accountBalance: number}