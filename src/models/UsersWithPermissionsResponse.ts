import type {UserDto} from "./UserDto.ts";
import type {Permission} from "../enums/Permission.ts";
import type {MachineDto} from "./MachineDto.ts";

export interface UsersWithPermissionsResponse {
    user: UserDto;
    permissions: Permission[];
    machines: MachineDto[];
}