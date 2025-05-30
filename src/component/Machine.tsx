import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import {
    Box,
    Heading,
    Stack,
    Flex,
    Text,
    Divider,
    useColorModeValue,
    Select,
} from "@chakra-ui/react";
import type { TelemetryItem } from "../models/TelemetryItem";
import { request } from "../utils/request";
import type { MachineDto } from "../models/MachineDto";

export const Machine: React.FC = () => {
    const hubUrl = "http://localhost:5151/machinesHub";

    const [machines, setMachines] = useState<MachineDto[]>([]);
    const [selectedMachineId, setSelectedMachineId] = useState<string>("");
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [dataMap, setDataMap] = useState<Map<string, any>>(new Map());

    const bgColor = useColorModeValue("white", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    // Получение списка машин при монтировании компонента
    useEffect(() => {
        const fetchMachines = async () => {
            try {
                const res = await request<MachineDto[]>("GetAllMachines", "GET");
                setMachines(res);
                if (res.length > 0) {
                    setSelectedMachineId(res[0].machineId);
                }
            } catch (err) {
                console.error("Ошибка при получении списка машин:", err);
            }
        };

        fetchMachines();
    }, []);

    // Обработка смены выбранной машины
    useEffect(() => {
        if (!selectedMachineId) return;

        // Завершение предыдущего соединения
        if (connection) {
            connection.stop();
            setConnection(null);
        }

        // Очистка отображаемых данных
        setDataMap(new Map());

        // Установка нового соединения
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, {
                accessTokenFactory: () => localStorage.getItem("access_token") ?? "",
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);

        const startConnection = async () => {
            try {
                await newConnection.start();
                console.log("SignalR подключен");

                await newConnection.invoke("SubscribeToMachine", selectedMachineId);
                console.log(`Подписка на ${selectedMachineId}`);

                newConnection.on("ReceiveData", (_mid: string, payload: TelemetryItem) => {
                    setDataMap((prevDataMap) => {
                        const newDataMap = new Map(prevDataMap);
                        newDataMap.set(payload.variable, payload.value);
                        return newDataMap;
                    });
                });
            } catch (err) {
                console.error("Ошибка SignalR:", err);
            }
        };

        startConnection();

        return () => {
            newConnection.stop();
        };
    }, [selectedMachineId]);

    return (
        <Box p={6} bg={bgColor} borderRadius="md" boxShadow="md">
            <Heading size="md" mb={4}>
                Выберите машину
            </Heading>

            <Select
                placeholder="Выберите машину"
                value={selectedMachineId}
                onChange={(e) => setSelectedMachineId(e.target.value)}
                mb={4}
            >
                {machines.map((machine) => (
                    <option key={machine.machineId} value={machine.machineId}>
                        {machine.machineName}
                    </option>
                ))}
            </Select>

            <Heading size="md" mb={4}>
                Данные машины: {selectedMachineId}
            </Heading>

            {dataMap.size === 0 ? (
                <Text color="gray.500">Ожидание данных...</Text>
            ) : (
                <Stack spacing={3}>
                    {Array.from(dataMap.entries()).map(([variable, value]) => (
                        <Box key={variable}>
                            <Flex justify="space-between" align="center">
                                <Text fontWeight="medium">{variable}</Text>
                                <Text>{String(value)}</Text>
                            </Flex>
                            <Divider borderColor={borderColor} />
                        </Box>
                    ))}
                </Stack>
            )}
        </Box>
    );
};
