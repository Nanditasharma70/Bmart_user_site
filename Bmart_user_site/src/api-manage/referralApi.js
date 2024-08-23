import MainApi from "./MainApi";
import { getToken } from "../helper-functions/getToken";

export const ReferralApi = {
  fetchReferrals: async () => {
    const token = getToken(); // Get the token dynamically
    console.log("Token: ", token); // Check if token is fetched correctly

    if (!token) {
      console.error("No token found. Please make sure you are authenticated.");
      return Promise.reject(new Error("No token provided"));
    }

    try {
      const response = await MainApi.get("/api/v1/customer/get-referrals", {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in headers
        },
      });
      return response.data; // Return the data from API response
    } catch (error) {
      console.error("Error fetching referrals: ", error.response || error.message);
      return Promise.reject(error);
    }
  },
};

export default ReferralApi;
