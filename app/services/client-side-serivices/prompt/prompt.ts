"use client"

export const getUsersPrompt = async () => {
  try {
    const getUsersBrandRes = await (await fetch("/api/users/brands")).json()
    
    if(getUsersBrandRes.brands){
      return getUsersBrandRes.brands;
    }
  } catch (e) {
    // log the error occured
  }
}

export const createUsersPrompt = async () => {
  try {
    const response = await (await fetch("/api/prompts")).json()
    
    
  } catch (e) {
    // log the error occured
  }
}