import { SetMetadata } from "@nestjs/common";
import { Role } from "../roles/role.enum";

export const roles_key = "roles";
export const Roles = (role:Role) => SetMetadata(roles_key,role);