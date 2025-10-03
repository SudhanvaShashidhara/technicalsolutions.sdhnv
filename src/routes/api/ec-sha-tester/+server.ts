import { json } from '@sveltejs/kit';
import crypto from "crypto";

import type { RequestHandler } from './$types';


export const GET: RequestHandler = async ({ url }) => {	

	const email = url.searchParams.get('email');
  const phone = url.searchParams.get('phone');

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

          return json({ email, email_hash, email_hash2 });
        }
    } else {
        return json({ error: "Provide a email query parameter" });
    }
    return json({ error: "Provide a email query parameter" });
};



	