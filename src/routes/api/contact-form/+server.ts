// import { json } from '@sveltejs/kit';
// import crypto from "crypto";
// import { initializeApp, cert, getApps } from "firebase-admin/app";
// import { getFirestore, FieldValue } from "firebase-admin/firestore";

// import { GSA_TYPE, GSA_PROJECT_ID, GSA_PRIVATE_KEY_ID, GSA_PRIVATE_KEY, GSA_CLIENT_EMAIL, GSA_CLIENT_ID, GSA_AUTH_URI, GSA_TOKEN_URI, GSA_AUTH_PROVIDER_X509_CERT_URL, GSA_CLIENT_X509_CERT_URL, GSA_UNIVERSE_DOMAIN } from "$env/static/private";

// import type { RequestHandler } from './$types';

// const GSA_PRIVATE_KEY_FINAL = GSA_PRIVATE_KEY.replace(/\\n/g, '\n');

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const firebase_service_account : any = {
// 	"type": GSA_TYPE,
// 	"project_id": GSA_PROJECT_ID,
// 	"private_key_id": GSA_PRIVATE_KEY_ID,
// 	"private_key": GSA_PRIVATE_KEY_FINAL,
// 	"client_email": GSA_CLIENT_EMAIL,
// 	"client_id": GSA_CLIENT_ID,
// 	"auth_uri": GSA_AUTH_URI,
// 	"token_uri": GSA_TOKEN_URI,
// 	"auth_provider_x509_cert_url": GSA_AUTH_PROVIDER_X509_CERT_URL,
// 	"client_x509_cert_url": GSA_CLIENT_X509_CERT_URL,
// 	"universe_domain": GSA_UNIVERSE_DOMAIN
// };

// if(!getApps().length){
// 	initializeApp({
// 		credential: cert(firebase_service_account)
// 	});  
// }
// else{
// 	getApps()[0]
// }

// const db = getFirestore();
// db.settings({ ignoreUndefinedProperties: true });

// export const POST: RequestHandler = async ({ request, getClientAddress }) => {	
// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 	const header_data: any = {};
// 	for (const pair of request.headers.entries()) {
// 		header_data[pair[0]] = pair[1];
// 	}
// 	const ip_address = getClientAddress();

//     if (email) {
//         const email_parts = email?.split("@");
//         const is_gmail = /(gmail|googlemail)\.com/g.test(email_parts[1]);
//         let normalized_email = "";
//         if (!is_gmail) {
//           return json({ error: "E Mail needs to be gmail or googlemail" });
//         }
//         if (is_gmail && email_parts.length > 1) {
//           normalized_email = email_parts[0].replace(".", "") + "@" + email_parts[1];
//           const email_hash = crypto
//             .createHash("sha256")
//             // updating data
//             .update(normalized_email)
//             // Encoding to be used
//             .digest("base64url");
    
//           return json({ email_hash });
//         }
//       } else {
//         return json({ error: "Provide a email query parameter" });
//       }
	
// 	try{
// 		await db.collection('hermes_project_3_form_submit_logs').add({ form_message: message, ip_address, city, country_logo_link, _ga_cookie, cookieyes_consent_cookie, timestamp: FieldValue.serverTimestamp() });
// 	}catch(err){
// 		console.log(err);
// 	}	
// };



	