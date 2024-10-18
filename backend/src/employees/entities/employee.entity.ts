
export interface Passwords{
    createdAt: Date;
    password: string;
}

export class Employee {
    name: string;
    surname: string;
    email: string;
    phone: string;
    birthday: Date;
    password: string;
    passwordSetAt?:Date;
    passwordExpiresAt?:Date;
    passwordsHistory?: Passwords[];
    gender: string;
    role: string;
}
