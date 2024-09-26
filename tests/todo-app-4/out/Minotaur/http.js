const defaultHeaders = {
    "Content-Type": "application/json",
};
async function send_HTTP_Request(method, url, headers = {}, body) {
    try {
        const response = await fetch(url, {
            method,
            headers: { ...defaultHeaders, ...headers },
            body: body ? JSON.stringify(body) : undefined,
        });
        const responseData = await response.json();
        return {
            data: responseData,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        };
    }
    catch (error) {
        throw error;
    }
}
export default send_HTTP_Request;
