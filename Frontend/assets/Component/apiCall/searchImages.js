import axios from "axios";

export const fetchSearchedImages = async (query, orientation, size) => {
  try {
    const response = await axios.get(
      `https://6780-103-248-222-152.ngrok-free.app/api/images/search`, // Update this to your API endpoint
      {
        params: { query, orientation, size }, // Attach query parameters dynamically
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching searched images:", error);
    throw new Error("Failed to fetch searched images");
  }
};
