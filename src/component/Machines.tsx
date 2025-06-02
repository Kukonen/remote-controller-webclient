import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useToast,
} from "@chakra-ui/react";
import { request } from "../utils/request";
import type { MachineDto } from "../models/MachineDto";

export const Machines: React.FC = () => {
    const [machines, setMachines] = useState<MachineDto[]>([]);
    const [newMachineName, setNewMachineName] = useState("");
    const [newMachineIpAddress, setNewMachineIpAddress] = useState("");
    const toast = useToast();

    useEffect(() => {
        loadMachines();
    }, []);

    const loadMachines = async () => {
        try {
            const res = await request<MachineDto[]>("GetAllMachines", "GET");
            setMachines(res);
        } catch {
            toast({ title: "Ошибка загрузки станков", status: "error" });
        }
    };

    const handleAddMachine = async () => {
        try {
            await request("AddMachine", "POST", {
                machineName: newMachineName,
                ipAddress: newMachineIpAddress
            });
            setNewMachineName("");
            await loadMachines();
            toast({ title: "Станок добавлен", status: "success" });
        } catch {
            toast({ title: "Ошибка при добавлении станка", status: "error" });
        }
    };

    const handleUpdateMachine = async (id: string, name: string, ipAddress: string) => {
        try {
            await request("UpdateMachine", "POST", {
                machineId: id,
                machineName: name,
                ipAddress: ipAddress
            });
            toast({ title: "Станок обновлён", status: "success" });
        } catch {
            toast({ title: "Ошибка при обновлении станка", status: "error" });
        }
    };

    const handleDeleteMachine = async (id: string) => {
        try {
            await request(`DeleteMachine?machineId=${id}`, "DELETE");
            await loadMachines();
            toast({ title: "Станок удалён", status: "success" });
        } catch {
            toast({ title: "Ошибка при удалении станка", status: "error" });
        }
    };

    return (
        <Box p={6}>
            <Heading mb={6}>Управление станками</Heading>
            <Stack spacing={2} mb={8} direction={{ base: "column", md: "row" }}>
                <FormControl>
                    <FormLabel>Название нового станка</FormLabel>
                    <Input
                        value={newMachineName}
                        onChange={(e) => setNewMachineName(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>IP-адрес нового станка</FormLabel>
                    <Input
                        value={newMachineIpAddress}
                        onChange={(e) => setNewMachineIpAddress(e.target.value)}
                    />
                </FormControl>
                <Button onClick={handleAddMachine} colorScheme="green" alignSelf="end" width={300}>
                    Добавить
                </Button>
            </Stack>

            <Stack spacing={4}>
                {machines.map((machine) => (
                    <Box key={machine.machineId} borderWidth={1} borderRadius="md" p={4}>
                        <FormControl mb={2}>
                            <FormLabel>Название станка</FormLabel>
                            <Input
                                value={machine.machineName}
                                onChange={(e) => {
                                    const updatedName = e.target.value;
                                    setMachines((prev) =>
                                        prev.map((m) =>
                                            m.machineId === machine.machineId
                                                ? { ...m, machineName: updatedName }
                                                : m
                                        )
                                    );
                                }}
                                onBlur={() =>
                                    handleUpdateMachine(machine.machineId, machine.machineName, machine.ipAddress)
                                }
                            />
                        </FormControl>
                        <FormControl mb={2}>
                            <FormLabel>IP-адрес</FormLabel>
                            <Input
                                value={machine.ipAddress}
                                onChange={(e) => {
                                    const updatedAddress = e.target.value;
                                    setMachines((prev) =>
                                        prev.map((m) =>
                                            m.machineId === machine.machineId
                                                ? { ...m, ipAddress: updatedAddress }
                                                : m
                                        )
                                    );
                                }}
                                onBlur={() =>
                                    handleUpdateMachine(machine.machineId, machine.machineName, machine.ipAddress)
                                }
                            />
                        </FormControl>
                        <Box fontSize="sm" color="gray.500" mb={2}>
                            ID: {machine.machineId}
                        </Box>
                        <Button
                            colorScheme="red"
                            onClick={() => handleDeleteMachine(machine.machineId)}
                        >
                            Удалить
                        </Button>
                    </Box>
                ))}
            </Stack>

        </Box>
    );
};