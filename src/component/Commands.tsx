import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Select,
    Stack,
    Textarea,
    useToast,
    Flex,
    Tooltip,
    Icon,
} from "@chakra-ui/react";
import { request } from "../utils/request";
import type { CommandDto } from "../models/CommandDto";
import { CommandType } from "../enums/CommandType.ts";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import "./Command.css";


export const Commands: React.FC = () => {
    const [commands, setCommands] = useState<CommandDto[]>([]);
    const [selectedId, setSelectedId] = useState<string>("new");
    const [form, setForm] = useState<CommandDto>({
        commandId: "",
        name: "",
        commandType: CommandType.SSH,
        commandText: "",
        additionalInformationText: "",
    });
    const [hasSaved, setHasSaved] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const toast = useToast();

    useEffect(() => {
        loadCommands();
    }, []);

    const loadCommands = async () => {
        try {
            const res = await request<CommandDto[]>("GetAllCommands", "GET");
            setCommands(res);
        } catch {
            toast({ title: "Ошибка загрузки команд", status: "error" });
        }
    };

    const handleSelect = (id: string) => {
        setSelectedId(id);
        setHasSaved(false);
        setFile(null);
        if (id === "new") {
            setForm({
                commandId: "",
                name: "",
                commandType: CommandType.SSH,
                commandText: "",
                additionalInformationText: "",
            });
        } else {
            const cmd = commands.find((c) => c.commandId === id)!;
            setForm({ ...cmd });
        }
    };

    const handleChange = (
        key: keyof CommandDto,
        value: string | CommandType
    ) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
        setHasSaved(false);
    };

    const isFormValid =
        form.name.trim() !== "" &&
        form.commandText.trim() !== "" &&
        form.commandType !== undefined;

    const handleSave = async () => {
        try {
            if (selectedId === "new") {
                await request("AddCommand", "POST", {
                    name: form.name,
                    commandType: form.commandType,
                    commandText: form.commandText,
                    additionalInformationText: form.additionalInformationText,
                });
                toast({ title: "Команда добавлена", status: "success" });
            } else {
                await request("UpdateCommand", "POST", {
                    commandId: form.commandId,
                    name: form.name,
                    commandType: form.commandType,
                    commandText: form.commandText,
                    additionalInformationText: form.additionalInformationText,
                });
                toast({ title: "Команда сохранена", status: "success" });
            }
            await loadCommands();
            setHasSaved(true);
        } catch {
            toast({ title: "Ошибка при сохранении", status: "error" });
        }
    };

    const handleExecute = async () => {
        if (!form.commandId) {
            toast({ title: "Команда не выбрана", status: "warning" });
            return;
        }

        const formData = new FormData();
        formData.append("commandId", form.commandId);
        if (file) {
            formData.append("file", file);
        }

        try {
            await request("ExecuteCommand", "POST", formData);
            toast({ title: "Команда выполнена", status: "success" });
        } catch {
            toast({ title: "Ошибка при выполнении команды", status: "error" });
        }
    };

    return (
        <Box p={6}>
            <Heading mb={4}>Управление командами</Heading>

            <Flex mb={6} align="center" gap={4}>
                <FormControl w="300px">
                    <FormLabel>Выберите команду</FormLabel>
                    <Select
                        value={selectedId}
                        onChange={(e) => handleSelect(e.target.value)}
                    >
                        <option value="new">— Новая команда —</option>
                        {commands.map((cmd) => (
                            <option key={cmd.commandId} value={cmd.commandId}>
                                {cmd.name}
                            </option>
                        ))}
                    </Select>
                </FormControl>
                <Button onClick={() => handleSelect("new")} colorScheme="blue">
                    Добавить команду
                </Button>
            </Flex>

            <Stack spacing={4}>
                <FormControl isRequired>
                    <FormLabel>Название</FormLabel>
                    <Input
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Тип команды</FormLabel>
                    <Select
                        value={form.commandType}
                        onChange={(e) =>
                            handleChange("commandType", Number(e.target.value))
                        }
                    >
                        <option value={CommandType.SSH}>SSH</option>
                        <option value={CommandType.HTTP}>HTTP</option>
                    </Select>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Текст команды</FormLabel>
                    <Textarea
                        value={form.commandText}
                        onChange={(e) => handleChange("commandText", e.target.value)}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Доп. информация</FormLabel>
                    <Textarea
                        value={form.additionalInformationText}
                        onChange={(e) =>
                            handleChange("additionalInformationText", e.target.value)
                        }
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Загрузить файл (опционально)</FormLabel>
                    <div>
                        <input
                            type="file"
                            id="fileInput"
                            className="hidden-file-input"
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setFile(e.target.files[0]);
                                } else {
                                    setFile(null);
                                }
                            }}
                        />
                        <label htmlFor="fileInput" className="custom-file-upload">
                            Выбрать файл
                        </label>
                        <span className="file-name">
              {file ? file.name : "Файл не выбран"}
            </span>
                    </div>
                </FormControl>

                <Flex gap={4} align="center">
                    <Button
                        onClick={handleSave}
                        colorScheme="green"
                        isDisabled={!isFormValid}
                    >
                        {selectedId === "new" ? "Создать" : "Сохранить"}
                    </Button>

                    <Tooltip
                        label="Команда выполнится корректно, если была предварительно сохранена"
                        hasArrow
                        placement="top"
                        bg="gray.700"
                        color="white"
                    >
                        <Flex align="center" gap={2}>
                            <Button
                                onClick={handleExecute}
                                colorScheme="purple"
                                isDisabled={!isFormValid}
                            >
                                Выполнить
                            </Button>
                            <Icon as={InfoOutlineIcon} color="gray.500" />
                        </Flex>
                    </Tooltip>
                </Flex>
            </Stack>
        </Box>
    );
};
