
export interface Passwords{
    createdAt: Date;
    password: string;
}
export enum  Genders {
    male="MALE",
    female="FEMALE",
    other="OTHER"
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
    gender: Genders;
    role: string;
}
export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
    EMPLOYEE = 'EMPLOYEE',
  }
  