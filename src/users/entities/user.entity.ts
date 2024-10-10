export interface Direction{
    street: string;
    city: string;
    country: string;
    neighborhood: string;
    references: string;
}

export class User {
    name: string;
    surname: string;
    email: string;
    phone: string;
    birthday: Date;
    password: string;
    gender?: string;
    direction?: Direction[];
    active?: boolean;
}
