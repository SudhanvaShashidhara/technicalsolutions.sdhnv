import { json } from '@sveltejs/kit';
import { initializeApp, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import { ABSTRACT_API_KEY, GSA_TYPE, GSA_PROJECT_ID, GSA_PRIVATE_KEY_ID, GSA_PRIVATE_KEY, GSA_CLIENT_EMAIL, GSA_CLIENT_ID, GSA_AUTH_URI, GSA_TOKEN_URI, GSA_AUTH_PROVIDER_X509_CERT_URL, GSA_CLIENT_X509_CERT_URL, GSA_UNIVERSE_DOMAIN } from "$env/static/private";

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, getClientAddress, cookies }) => {	
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const header_data: any = {};
	const GSA_PRIVATE_KEY_FINAL = GSA_PRIVATE_KEY.replace(/\\n/g, '\n');
	console.log({GSA_PRIVATE_KEY,GSA_PRIVATE_KEY_FINAL});
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const firebase_service_account : any = {
		"type": GSA_TYPE,
		"project_id": GSA_PROJECT_ID,
		"private_key_id": GSA_PRIVATE_KEY_ID,
		"private_key": GSA_PRIVATE_KEY_FINAL,
		"client_email": GSA_CLIENT_EMAIL,
		"client_id": GSA_CLIENT_ID,
		"auth_uri": GSA_AUTH_URI,
		"token_uri": GSA_TOKEN_URI,
		"auth_provider_x509_cert_url": GSA_AUTH_PROVIDER_X509_CERT_URL,
		"client_x509_cert_url": GSA_CLIENT_X509_CERT_URL,
		"universe_domain": GSA_UNIVERSE_DOMAIN
	};
	initializeApp({
		credential: cert(firebase_service_account)
	});
	if(getApp()) {  
		const db = getFirestore();
		db.settings({ ignoreUndefinedProperties: true })

		let message : string = 'Thanks for submitting the form. Have a good day!';
		for (const pair of request.headers.entries()) {
			header_data[pair[0]] = pair[1];
		}
		const ip_address = getClientAddress();
		const preferred_language = header_data["accept-language"].split(',')[0];
		const polish_message = `Dziękujemy za przesłanie formularza. Miłego dnia!`; // "accept-language": "pl,en-US;q=0.9,en;q=0.8",
		const german_message = `Vielen Dank für das Absenden des Formulars. Haben Sie einen guten Tag!`; // "accept-language": "de,pl;q=0.9,de-AT;q=0.8,en-US;q=0.7,en;q=0.6,de-DE;q=0.5,de-LI;q=0.4,de-CH;q=0.3",
		const french_message = `Merci d'avoir soumis le formulaire. Passe une bonne journée!`; // "accept-language": "fr-FR,fr-CA;q=0.9,fr;q=0.8,en;q=0.7,en-US;q=0.6",
		const italian_message = `Grazie per aver inviato il modulo. Buona giornata!`; // "accept-language": "it-CH,it-IT;q=0.9,it;q=0.8,en;q=0.7,en-US;q=0.6",
		if(preferred_language.includes("it")) message = italian_message;
		else if(preferred_language.includes("fr")) message = french_message;
		else if(preferred_language.includes("de")) message = german_message;
		else if(preferred_language.includes("pl")) message = polish_message;
		const data = await fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=${ABSTRACT_API_KEY}&ip_address=${ip_address}`);
		const json_data = await data.json();
		let city = '', country_logo_link;
		if(json_data["city"]) city =  json_data["city"];
		if(json_data["flag"] && json_data["flag"]["png"]) country_logo_link = json_data["flag"]["png"];
		const _ga_cookie = cookies.get('_ga');
		const cookieyes_consent_cookie = cookies.get('cookieyes-consent');
		try{
			await db.collection('hermes_project_3_form_submit_logs').add({ form_message: message, ip_address, city, country_logo_link, _ga_cookie, cookieyes_consent_cookie});
		}catch(err){
			console.log(err);
		}	
		return json({ form_message: message, ip_address, city, country_logo_link, _ga_cookie, cookieyes_consent_cookie});
	}
	return json({error: "SERVER ERROR"});
};



	