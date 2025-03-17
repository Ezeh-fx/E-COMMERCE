import axios from "axios";
import { envVaraibles } from "../env/environmentVar";


const OPENCAGE_API_KEY =envVaraibles.OPENCAGE_API_KEY;

export const getCordinate = async (address: string) => {
  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${OPENCAGE_API_KEY}`
    );

    if (response.data && response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry;
      return { latitude: lat, longitude: lng };
    } else {
      return { latitude: null, longitude: null };
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return { latitude: null, longitude: null };
  }
};

export const getAddressDetails = async (address: string) => {
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${OPENCAGE_API_KEY}`
      );
  
      if (response.data && response.data.results.length > 0) {
        const result = response.data.results[0].components;
  
        return {
          country: result.country || null,
          city: result.city || result.town || result.village || null,
          postalCode: result.postcode || null,
        };
      } else {
        return { country: null, city: null, postalCode: null };
      }
    } catch (error) {
      console.error("Error fetching address details:", error);
      return { country: null, city: null, postalCode: null };
    }
  };