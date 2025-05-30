import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, Outlet } from 'react-router-dom';
import {Permission} from "../enums/Permission.ts";
import {useUserStore} from "../store/userStore.ts";

export const Layout = () => {
    const navigate = useNavigate();
    const user = useUserStore((state) => state.user);
    const clearUser = useUserStore((state) => state.clearUser);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        clearUser();
        navigate('/login');
    };

    return (
        <Box>
            <Flex
                as="nav"
                bg="gray.800"
                color="white"
                p={4}
                justify="space-between"
                align="center"
            >
                <Flex gap={4}>
                    <Box fontWeight="bold">Управление станками</Box>
                    {user?.permissions?.includes(Permission.User_Read) && (
                        <Link as={RouterLink} to="/users">Пользователи</Link>
                    )}
                    {user?.permissions?.includes(Permission.Machine_Read) && (
                        <Link as={RouterLink} to="/machines">Станки</Link>
                    )}
                    {user !== null && user !== undefined && (
                        <Link as={RouterLink} to="/machine">Телеметрия</Link>
                    )}
                    {user !== null && user !== undefined && (
                        <Link as={RouterLink} to="/commands">Команды</Link>
                    )}
                </Flex>
                <Flex gap={4}>
                    {user !== null && user !== undefined ?  (
                        <Button onClick={handleLogout} colorScheme="red" size="sm">
                            Выйти
                        </Button>
                    ) : (
                        <Link as={RouterLink} to="/login">
                            Войти
                        </Link>
                    )}
                </Flex>
            </Flex>
            <Box p={4}>
                <Outlet />
            </Box>
        </Box>
    );
};
