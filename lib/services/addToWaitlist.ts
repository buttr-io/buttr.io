"use server";

import { query } from './neonDB';
import { FormValues } from '@/app/home/components/ContactModal';

const inDevMode = process.env.DEV === "true";
console.log("inDevMode: ", inDevMode);

export async function addToWaitlist(formValues: FormValues) {
  console.log("formValues: ", formValues);
  const isTest = inDevMode;
  const { name, email, contact_number, brand, purpose } = formValues;


  try {
    const text = `
            INSERT INTO EARLY_ACCESS_USERS (name, email, phone_number, brand, purpose, test)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
    const params = [
      name,
      email,
      contact_number || null,
      brand || null,
      purpose,
      isTest
    ];

    const data = await query(text, params);
    return data;
  } catch (error) {
    console.error("Database error in addToWaitlist:", error);
    throw error;
  }
}
