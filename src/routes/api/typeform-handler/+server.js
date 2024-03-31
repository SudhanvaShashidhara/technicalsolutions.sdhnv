import { json } from '@sveltejs/kit';
import { TYPEFORM_TOKEN } from "$env/static/private"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const typeform_data = await request.json();
    const form_id = typeform_data.formId;
    const response_id = typeform_data.response_id;

    const data = await fetch(`https://api.typeform.com/forms/${form_id}/responses?included_response_ids=${response_id}`, {
        headers: {
            "Authorization": `Bearer ${TYPEFORM_TOKEN}`
        }
    });
    const json_data = await data.json();
    console.log(json_data);
		// error(400, 'min and max must be numbers, and min must be less than max');


    return json(json_data);
    // return json();
}