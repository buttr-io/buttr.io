export const getLocations = async () => {
  try {
    const response = await (await fetch("/api/locations")).json()
    return response;
  } catch (e) {
    // log the error occured
    console.log("Some error occured while getting locations", e)
    throw e
  }
}