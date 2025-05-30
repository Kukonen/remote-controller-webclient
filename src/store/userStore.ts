import { create } from 'zustand';
import type {UserInfo} from "../models/UserInfo.ts";
import type {UsersWithPermissionsResponse} from "../models/UsersWithPermissionsResponse.ts";


interface UserStore {
    user: UserInfo | null;
    setUser: (userResponse: UsersWithPermissionsResponse) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (userResponse) => set({
        user:  {
            user: userResponse.user,
            permissions: userResponse.permissions,
            machines: userResponse.machines
        },
    }),
    clearUser: () => set({ user: null }),
}));
