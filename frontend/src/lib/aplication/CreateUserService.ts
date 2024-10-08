import { UserRepository } from "../domain/users/UserRepository";

export const createUserService = (user:UserRepository)=>({
    getUser:() => user.getUser(),
    save:(name:string,lastname:string,email:string,phone:string,password:string,birthdate:Date) => user.save({
        name,
        lastname,
        birthdate,
        email,
        password,
        phone,
    }),
})