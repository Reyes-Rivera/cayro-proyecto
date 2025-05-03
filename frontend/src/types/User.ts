export interface UserLogin {
    identifier: string;
    password: string;
}

export interface Direction{
    street: string;
    city: string;
    sate:string;
    country: string;
    postalCode: string;
    colony: string;
    id:number;
    isDefault?: boolean;
}

export interface User {
    name: string;
    surname: string;
    email: string;
    phone: string;
    birthdate: Date;
    password: string;
    gender: string;
    direction?: Direction[];
    active?: boolean;
    role?: string;
    confirmPassword?:string,
    id?: string;
}


