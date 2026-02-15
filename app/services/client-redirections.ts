import { getUsersBrand } from "./user/user";

// Requires x-user-id to be set. 
// x-user-id would get automatically set by the middleware if session token is set and routing is towards the dashboard
export async function redirectToDashboard(){
    const brands = await getUsersBrand()
    let brandId = "";
    if(brands && brands.length) brandId = brands[0].id

    window.location.href = `/?brand_id=${brandId}`;
}