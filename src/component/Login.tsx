import { useState } from 'react';
import {
    Box, Button, Input, FormControl, FormLabel, VStack, Heading, useToast
} from '@chakra-ui/react';
import { request } from '../utils/request';
import {useNavigate} from "react-router-dom";
import type {UsersWithPermissionsResponse} from "../models/UsersWithPermissionsResponse.ts";
import {parseJwt} from "../utils/parseJwt.ts";
import {useUserStore} from "../store/userStore.ts";

export default function Login() {
    const navigate = useNavigate();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const toast = useToast();

    const handleSubmit = async () => {
        if (!login || !password) {
            toast({
                title: 'Пожалуйста, заполните все поля.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const data = await request<{ accessToken: string; refreshToken: string }>(
                'login', 'POST', { login, password }
            );

            localStorage.setItem('access_token', data.accessToken);
            localStorage.setItem('refresh_token', data.refreshToken);

            const parsedAccessToken = parseJwt(data.accessToken);
            const userId = parsedAccessToken?.nameid;
            if (!userId) return;

            const userData = await request<UsersWithPermissionsResponse>(
                `GetUserWithPermissionsAndMachines/${userId}`,
                'GET'
            );

            useUserStore.getState().setUser(userData);

            toast({ title: 'Успешный вход!', status: 'success', duration: 3000, isClosable: true });
            navigate('/');
        } catch (err) {
            toast({ title: 'Ошибка входа', status: 'error', duration: 3000, isClosable: true });
        }
    };

    return (
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
            <Box bg="white" p={8} rounded="md" shadow="lg" w="100%" maxW="400px">
                <Heading mb={6} textAlign="center">
                    Вход
                </Heading>
                <VStack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Логин</FormLabel>
                        <Input value={login} onChange={(e) => setLogin(e.target.value)} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Пароль</FormLabel>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>
                    <Button colorScheme="blue" width="full" onClick={handleSubmit}>
                        Войти
                    </Button>
                </VStack>
            </Box>
        </Box>
    );
}
