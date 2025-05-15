import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const Layout = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsAuthenticated(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
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
                <Box fontWeight="bold">MyApp</Box>
                <Flex gap={4}>
                    {isAuthenticated ? (
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
