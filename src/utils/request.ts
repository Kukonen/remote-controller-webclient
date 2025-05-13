type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

let accessToken: string | null = localStorage.getItem('access_token');
let refreshToken: string | null = localStorage.getItem('refresh_token');

const refreshAccessToken = async (): Promise<boolean> => {
    if (!refreshToken) {
        return false;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
        const data = await response.json();
        const accessToken = data.accessToken;
        const refreshToken = data.refreshToken;

        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);

        return true;
    }

    return false;
}

export async function request<T>(
    path: string,
    method: HttpMethod,
    body?: any
): Promise<T> {
    const makeRequest = async (): Promise<Response> => {
        return await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            },
            body: body ? JSON.stringify(body) : undefined,
        });
    };

    let response = await makeRequest();

    if (response.status === 401 && await refreshAccessToken()) {
        response = await makeRequest();
    }

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API Error ${response.status}: ${errorBody}`);
    }

    return response.json();
}
