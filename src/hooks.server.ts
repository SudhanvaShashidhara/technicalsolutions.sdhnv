import type { Handle } from "@sveltejs/kit";
import { redirect } from '@sveltejs/kit';

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

    const ogt_landing_page_url = event.url.pathname.includes("ogt/landing-page") && event.url.searchParams.get("gclid");
    if(ogt_landing_page_url){
        const search_params = new URLSearchParams(event.url.search);
        const current_gclid = search_params.get('gclid');
        const new_gclid = current_gclid?.toLowerCase();
        if(current_gclid !== new_gclid){
            search_params.set("gclid",new_gclid ? new_gclid : "");
            const new_url = event.url.href.split('?')[0] + "?" + search_params.toString() + event.url.hash;
            return redirect(302, new_url);
        }   
    }

    return response;
}