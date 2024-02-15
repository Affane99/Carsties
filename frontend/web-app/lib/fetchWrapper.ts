import { getTokenWorkaround } from "@/app/actions/authActions";
import path from "path";

const baseUrl = 'http://localhost:6001/';

async function get(url: string) {
    const requestOptions = {
        method: "GET",
        headers: await getHeaders()
    }

    const response = await fetch(path.join(baseUrl, url), requestOptions);
    return await handleResponse(response);
}

async function post(url: string, body: {}) {
    const requestOptions = {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify(body)
    }

    const response = await fetch(path.join(baseUrl, url), requestOptions);

    return await handleResponse(response);
}

async function put(url: string, body: {}) {
    const requestOptions = {
        method: "PUT",
        headers: await getHeaders(),
        body: JSON.stringify(body)
    }

    const response = await fetch(path.join(baseUrl, url), requestOptions);

    return await handleResponse(response);
}

async function del(url: string) {
    const requestOptions = {
        method: "DELETE",
        headers: await getHeaders()
    }

    const response = await fetch(path.join(baseUrl, url), requestOptions);

    return await handleResponse(response);
}

async function uploadImage(url: string, data: FormData) {
    const headers = await getHeaders();
    delete headers['content-type'];
    const requestOptions = {
        method: "POST",
        headers: headers,
        body: data
    }
    const response = await fetch(path.join(baseUrl, url), requestOptions);

    return await handleResponse(response);
}

async function getHeaders() {
    const token = await getTokenWorkaround();
    const headers: any = { 'content-type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token?.access_token}`;
    }
    return headers;
}

async function handleResponse(response: Response) {
    const text = await response.text();
    let data:any;
    try {
        data = text && JSON.parse(text);
    } catch (error) {
        data = text && text;
    }

    if (response.ok) {
        return data || response.statusText;
    }

    const error = {
        status: response.status,
        message: response.statusText
    }

    return { error };
}

export const fetchWrapper = {
    get,
    post,
    put,
    del,
    uploadImage
}