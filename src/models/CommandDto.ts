import type {CommandType} from "../enums/CommandType.ts";

export interface CommandDto {
    commandId: string;
    name: string;
    commandType: CommandType;
    commandText: string;
    additionalInformationText: string;
}