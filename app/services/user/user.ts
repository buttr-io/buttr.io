export const getUsersBrand = async () => {
    try {
      const getUsersBrandRes = await (await fetch("/api/users/brands")).json()
      console.log("User brands",getUsersBrandRes)
      if(getUsersBrandRes.brands){
        return getUsersBrandRes.brands;
      }
    } catch (e) {
      // log the error occured
    }
  }