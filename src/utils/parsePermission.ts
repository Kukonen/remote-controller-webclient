import { Permission } from "../enums/Permission";

export const parsePermission = (permission: Permission): string => {
    switch (permission) {
        case Permission.Command_Read:
            return "Просмотр команд";
        case Permission.Command_Write:
            return "Редактирование команд";
        case Permission.User_Read:
            return "Просмотр пользователей";
        case Permission.User_Write:
            return "Редактирование пользователей";
        case Permission.Machine_Read:
            return  "Просмотр станков";
        case Permission.Machine_Write:
            return  "Редактирование станков";
        default:
            return permission;
    }
}