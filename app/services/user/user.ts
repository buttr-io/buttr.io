"use client"

export const getUsersBrand = async () => {
  try {
    const getUsersBrandRes = await (await fetch("/api/users/brands")).json()
    
    if(getUsersBrandRes.brands){
      return getUsersBrandRes.brands;
    }
  } catch (e) {
    // log the error occured
  }
}

export const logout = async () => {
  await fetch("/api/logout", { method: "POST" });
  window.location.assign("/login");
}