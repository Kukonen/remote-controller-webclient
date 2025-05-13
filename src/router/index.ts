import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../components/LoginForm.vue';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginForm },
];

export const router = createRouter({
    history: createWebHistory(),
    routes
});