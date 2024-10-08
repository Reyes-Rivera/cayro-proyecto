import { Users } from "./Users";

export interface UserRepository{
    getUser():Promise<void>,
    save(User:Users):Promise<void>,
    update(User:Users):Promise<void>,
    delete(User:Users):Promise<void>
}