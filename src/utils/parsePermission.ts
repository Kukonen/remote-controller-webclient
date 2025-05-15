import { Permission } from "../enums/Permission";

export const parsePermission = (permission: Permission): string => {
    switch (permission) {
        case Permission.Command_Read:
            return "Чтение команд";
        case Permission.Command_Write:
            return "Запись команд";
        case Permission.User_Read:
            return "Чтение пользователей";
        case Permission.User_Write:
            return "Запись пользователей";
        default:
            return "Неизвестное право";
    }
}