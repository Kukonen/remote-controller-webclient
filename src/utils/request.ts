type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const refreshAccessToken = async (): Promise<boolean> => {
    if (!localStorage.getItem('refresh_token')) {
        return false;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}Refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            RefreshToken: localStorage.getItem('refresh_token')
        }),
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
        const headers: Record<string, string> = {
            ...(localStorage.getItem('access_token') ? { Authorization: `Bearer ${localStorage.getItem('access_token')}` } : {}),
        };

        const isFormData = body instanceof FormData;

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        return await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
            method,
            headers,
            body: isFormData ? body : body ? JSON.stringify(body) : undefined,
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

    const text = await response.text();
    try {
        return text ? JSON.parse(text) : {} as T;
    } catch (e) {
        throw new Error(`Ошибка парсинга JSON: ${text}`);
    }
}
