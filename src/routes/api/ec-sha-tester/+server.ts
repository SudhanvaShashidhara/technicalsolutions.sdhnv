import { json } from '@sveltejs/kit';
import crypto from "crypto";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

import { GSA_TYPE, GSA_PROJECT_ID, GSA_PRIVATE_KEY_ID, GSA_PRIVATE_KEY, GSA_CLIENT_EMAIL, GSA_CLIENT_ID, GSA_AUTH_URI, GSA_TOKEN_URI, GSA_AUTH_PROVIDER_X509_CERT_URL, GSA_CLIENT_X509_CERT_URL, GSA_UNIVERSE_DOMAIN } from "$env/static/private";

import type { RequestHandler } from './$types';

const GSA_PRIVATE_KEY_FINAL = GSA_PRIVATE_KEY.replace(/\\n/g, '\n');

//eslint-disable-next-line @typescript-eslint/no-explicit-any
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

if(!getApps().length){
	initializeApp({
		credential: cert(firebase_service_account)
	});  
}
else{
	getApps()[0]
}

const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

export const GET: RequestHandler = async ({ url, getClientAddress }) => {	

	const email = url.searchParams.get('email');
  const phone = url.searchParams.get('phone');


  const ip_address = getClientAddress();

  if(phone){
    const new_phone_number = phone.includes("+") ? phone : "+" + phone;
    const normalised_phone = new_phone_number.trim().replaceAll(" ", "").toLocaleLowerCase();
    const phone_hash = crypto
      .createHash("sha256")
      // updating data
      .update(normalised_phone)
      // Encoding to be used
      .digest("base64url");

     const phone_hash2 = crypto
      .createHash("sha256")
      // updating data
      .update(normalised_phone)
      // Encoding to be used
      .digest("hex"); 

      try{
        await db.collection('ec-sha-tester').add({ ip_address, timestamp: FieldValue.serverTimestamp(), phone, phone_hash, phone_hash2 });
      }catch(err){
        console.log(err);
      }	

    return json({ normalised_phone, phone_hash, phone_hash2 });
  }


    if (email) {
        const email_parts = email?.toLowerCase().split("@");
        let normalized_email = "";

        if (email_parts.length > 1) {

          normalized_email = email_parts[0].replace(/\./g, "") + "@" + email_parts[1];

          const email_hash = crypto
            .createHash("sha256")
            // updating data
            .update(normalized_email)
            // Encoding to be used
            .digest("base64url");
          const email_hash2 = crypto
            .createHash("sha256")
            // updating data
            .update(normalized_email)
            // Encoding to be used
            .digest("hex");

            try{
              await db.collection('ec-sha-tester').add({ ip_address, timestamp: FieldValue.serverTimestamp(), email, email_hash, email_hash2 });
            }catch(err){
              console.log(err);
            }	

          return json({ email, email_hash, email_hash2 });
        }
    } else {
        return json({ error: "Provide a email query parameter" });
    }
    return json({ error: "Provide a email query parameter" });
};



	