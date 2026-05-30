import { json } from '@sveltejs/kit';
// import { GoogleGenAI } from "@google/genai";
// import { GEMINI_API_KEY } from "$env/static/private";

// const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	console.log(await request.json());
	try {
		const data = await request.json();
		console.log(data);
		const { eventLog, domStructure, appLicationType } = data;

		// 2. Validate data (Basic example)
		// if (!eventLog || !domStructure || !appLicationType) {
		//     return json({ error: 'Missing required fields' }, { status: 400 });
		// }
		console.log({ eventLog, domStructure, appLicationType });
		// 3. Process data (e.g., save to database)
		console.log(`Received ${eventLog.length} events.`);
		// await db.logs.create({ ... })

		// 4. Call Gemini API
		//         const gemini_response = await ai.models.generateContent({
		//             model: "gemini-2.5-flash",
		//             contents: `"Analyze the provided DOM structure to determine if a form submission or a completed purchase event has occurred.

		// Instructions:
		// - If a form submission is detected, provide a robust CSS selector for the form's success message, the full confirmation text, and a part of the message that can be used in a 'Text Contains' condition.
		// - If a purchase is detected, provide robust CSS selectors for the total order value, transaction ID, and currency code, if available. If not available, return null for those fields.
		// - If neither event can be reliably identified, indicate an unknown detection type.

		// After determining the event type and extracting data, double-check the detected type and field accuracy before returning the final JSON.

		// Response Format:
		// Return only a single, valid JSON object that matches one of these three structures. Do not include any text or markdown before or after the JSON:

		// Form Submission example:
		// {
		//   ""detectionType"": ""FORM_SUBMISSION"",
		//   ""data"": {
		//     ""messageSelector"": ""<CSS selector>"",
		//     ""messageText"": ""<confirmation text>"",
		//     ""messageTextUsable"": ""<usable partial text>""
		//   }
		// }

		// Purchase example:
		// {
		//   ""detectionType"": ""PURCHASE"",
		//   ""data"": {
		//     ""orderTotalSelector"": ""<CSS selector or null>"",
		//     ""transactionIdSelector"": ""<CSS selector or null>"",
		//     ""currencySelector"": ""<CSS selector or null>""
		//   }
		// }

		// Unknown event:
		// {
		//   ""detectionType"": ""UNKNOWN"",
		//   ""data"": null
		// }

		// DOM Structure below:"${domStructure}`
		//         });
		//         console.log(gemini_response);

		// 5. Return success response
		return json({ success: true });
	} catch (err) {
		console.error(err);
		return json({ error: 'An error occurred while processing the request.' }, { status: 500 });
	}
}
