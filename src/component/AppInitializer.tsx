import { useEffect } from 'react';
import {useUserStore} from "../store/userStore.ts";
import {parseJwt} from "../utils/parseJwt.ts";
import {request} from "../utils/request.ts";
import type {UsersWithPermissionsResponse} from "../models/UsersWithPermissionsResponse.ts";


export const AppInitializer = () => {
    const setUser = useUserStore((state) => state.setUser);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const parsed = parseJwt(token);
        const userId = parsed?.nameid;
        if (!userId) return;

        try {
            const userData = await request<UsersWithPermissionsResponse>(
                `GetUserWithPermissionsAndMachines/${userId}`,
                'GET'
            );
            setUser(userData);
        } catch (e) {
            console.error('Ошибка при получении пользователя:', e);
        }
    };

    return null;
};