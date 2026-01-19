
import { FormValues } from '@/app/home/page';

import { createClient } from '@supabase/supabase-js'

const inDevMode = process.env.DEV === "true";
console.log("inDevMode: ", inDevMode);
if(!process.env.NEXT_PUBLIC_SUPABASE_URL) throw "Requires Supabase Url";
if(!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) throw "Requires Supabase Key";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// RISKY For sensitive data
export async function addToWaitlist(formValues: FormValues) {
    // Connect to the Neon database
    
    // Insert the comment from the form into the Postgres database
    // let query: TemplateStringsArray = 
    // await sql`INSERT INTO comments (comment) VALUES (${comment})`;
    const { data, error  } = await supabase.functions.invoke('node-api', {
      body: { ...formValues, isTest: inDevMode },
    })
    if(error) {
        console.log(error)
        return {error: true}
    }
    return data
}



