import type { Handle } from "@sveltejs/kit";

const corsHeaders = {
    // 'Cross-Origin-Embedder-Policy': 'require-corp',
    // 'Cross-Origin-Opener-Policy': 'same-origin',
    // // [...]
    // 'X-XSS-Protection': '0',
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
    "Access-Control-Allow-Headers": "*"
}

export const handle: Handle = async ({ event, resolve }) => {
    const response = await resolve(event);
    Object.entries(corsHeaders).forEach(
        ([header, value]) => response.headers.set(header, value)
    );

    return response;
}