import { UseGuards, applyDecorators } from "@nestjs/common";
import { Role } from "../roles/role.enum";
import { Roles } from "./roles.decorator";
import { AuthGuard } from "../auth.guard";
import { RolesGuard } from "../roles/roles.guard";

export function Auth(role:Role){
    return applyDecorators(Roles(role),UseGuards(AuthGuard,RolesGuard));
}