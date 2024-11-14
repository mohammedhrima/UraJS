interface ResponseConfig<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

const defaultHeaders = {
  "Content-Type": "application/json",
};

async function send_HTTP_Request<T>(
  method: string,
  url: string,
  headers: { [key: string]: string } = {},
  body?: any
): Promise<ResponseConfig<T>> {
  try {
    const response = await fetch(url, {
      method,
      headers: { ...defaultHeaders, ...headers },
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseData: T = await response.json();

    return {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  } catch (error) {
    throw error;
  }
}

export default send_HTTP_Request;
