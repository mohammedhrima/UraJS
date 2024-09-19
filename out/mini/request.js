class HTTP {
    constructor() {
        // Default configuration
        this.defaultHeaders = {
            "Content-Type": "application/json",
        };
    }
    // Main request function
    async request(config) {
        const { url, method = "GET", headers = {}, body } = config;
        const response = await fetch(url, {
            method,
            headers: { ...this.defaultHeaders, ...headers },
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
    // Unified send method
    async send(method, url, headers = {}, body) {
        return this.request({ method, url, headers, body });
    }
}
export default HTTP;
