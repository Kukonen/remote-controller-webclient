import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Text,
    useToast,
} from "@chakra-ui/react";
import { request } from "../utils/request";
import { parsePermission } from "../utils/parsePermission";
import { Permission } from "../enums/Permission";
import type { UsersWithPermissionsResponse } from "../models/UsersWithPermissionsResponse";
import type { MachineDto } from "../models/MachineDto";

const allPermissions: Permission[] = [
    Permission.Command_Read,
    Permission.Command_Write,
    Permission.User_Read,
    Permission.User_Write,
];

export const Users: React.FC = () => {
    const [users, setUsers] = useState<UsersWithPermissionsResponse[]>([]);
    const [machines, setMachines] = useState<MachineDto[]>([]);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const toast = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const machinesRes = await request<MachineDto[]>("GetAllMachines", "GET");
            setMachines(machinesRes);

            const usersRes = await request<UsersWithPermissionsResponse[]>(
                "GetUsersWithPermissionsAndMachines",
                "GET"
            );
            setUsers(usersRes);
        } catch (error) {
            toast({ title: "Ошибка загрузки данных", status: "error" });
        }
    };

    const togglePermission = (userId: string, permission: Permission) => {
        setUsers((prev) =>
            prev.map((u) =>
                u.user.userId === userId
                    ? {
                        ...u,
                        permissions: u.permissions.includes(permission)
                            ? u.permissions.filter((p) => p !== permission)
                            : [...u.permissions, permission],
                    }
                    : u
            )
        );
    };

    const toggleMachine = (userId: string, machineId: string) => {
        setUsers((prev) =>
            prev.map((u) =>
                u.user.userId === userId
                    ? {
                        ...u,
                        machines: u.machines.some((m) => m.machineId === machineId)
                            ? u.machines.filter((m) => m.machineId !== machineId)
                            : [...u.machines, machines.find((m) => m.machineId === machineId)!],
                    }
                    : u
            )
        );
    };

    const handleSave = async (user: UsersWithPermissionsResponse) => {
        try {
            await request("UpdateUserPermission", "POST", {
                userId: user.user.userId,
                permissions: user.permissions,
            });
            await request("UpdateUserMachines", "POST", {
                userId: user.user.userId,
                machinesIds: user.machines.map((m) => m.machineId),
            });
            toast({ title: "Сохранено", status: "success" });
        } catch (e) {
            toast({ title: "Ошибка при сохранении", status: "error" });
        }
    };

    const handleRegister = async () => {
        try {
            await request("register", "POST", {
                login,
                password,
                permissions: [],
            });
            await loadData();
            toast({ title: "Пользователь добавлен", status: "success" });
            setLogin("");
            setPassword("");
        } catch(error) {
            console.log(error)
            toast({ title: "Не удалось добавить пользователя", status: "error" });
        }
    };

    return (
        <Box p={6}>
            <Heading mb={6}>Пользователи</Heading>
            <Stack spacing={6}>
                {users.map((user) => (
                    <Box
                        key={user.user.userId}
                        p={4}
                        borderWidth="1px"
                        borderRadius="lg"
                        shadow="sm"
                    >
                        <Text fontWeight="bold" mb={2}>
                            {user.user.login}
                        </Text>
                        <Text mb={1}>Права:</Text>
                        <Flex gap={4} wrap="wrap">
                            {allPermissions.map((p) => (
                                <Checkbox
                                    key={p}
                                    isChecked={user.permissions.includes(p)}
                                    onChange={() => togglePermission(user.user.userId, p)}
                                >
                                    {parsePermission(p)}
                                </Checkbox>
                            ))}
                        </Flex>
                        <Text mt={4} mb={1}>Машины:</Text>
                        <Flex gap={4} wrap="wrap">
                            {machines.map((m) => (
                                <Checkbox
                                    key={m.machineId}
                                    isChecked={user.machines.some((um) => um.machineId === m.machineId)}
                                    onChange={() => toggleMachine(user.user.userId, m.machineId)}
                                >
                                    {m.machineName}
                                </Checkbox>
                            ))}
                        </Flex>
                        <Button mt={4} onClick={() => handleSave(user)} colorScheme="blue">
                            Сохранить
                        </Button>
                    </Box>
                ))}
            </Stack>

            <Box mt={10} borderTop="1px solid #ccc" pt={6}>
                <Heading size="md" mb={4}>Добавить пользователя</Heading>
                <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                    <FormControl>
                        <FormLabel>Логин</FormLabel>
                        <Input value={login} onChange={(e) => setLogin(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Пароль</FormLabel>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>
                    <Button alignSelf="end" onClick={handleRegister} colorScheme="green">
                        Добавить
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};
