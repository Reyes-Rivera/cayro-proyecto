export interface UserLogin {
    email: string;
    password: string;
}

export interface Direction{
    street: string;
    city: string;
    country: string;
    neighborhood: string;
    references: string;
}

export interface User {
    name: string;
    surname: string;
    email: string;
    phone: string;
    birthday: Date;
    password: string;
    gender?: string;
    direction?: Direction[];
    active?: boolean;
    role?: string;
    confirmPassword?:string
}
