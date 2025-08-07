// module.exports = async (req, res) => {
//   console.log("Endpoint hit");
//   try {
//     const response = await fetch('https://app.beekeys.com/nigeria/wp-json/geodir/v2/locations/regions/');
//     console.log("Fetch response status:", response.status);
//     const data = await response.json();
    
//     // Log data to confirm structure
//     console.log("API response data:", data);
    
//     // Check if data is an array
//     if (!Array.isArray(data)) {
//       throw new Error("Response data is not an array");
//     }
    
//     // Slice the first 3 items from data
//     res.status(200).json({ message: "Test endpoint working!", data: data.slice(0, 3) });
//   } catch (error) {
//     console.log("Error:", error.message);
//     res.status(500).json({ message: "Error fetching data", error: error.message });
//   }
// };

const fetch = require('node-fetch');

module.exports = async (req, res) => {
  console.log("Endpoint hit");

  try {
    const API_URL = `https://app.beekeys.com/nigeria/wp-json/geodir/v2/locations/regions/?consumer_key=${process.env.BEEKEYS_KEY}&consumer_secret=${process.env.BEEKEYS_SECRET}`;
    const response = await fetch(API_URL);
    
    console.log("Fetch response status:", response.status);
    const data = await response.json();
    console.log("API response data:", data);

    if (!Array.isArray(data)) {
      throw new Error("Response data is not an array");
    }

    res.status(200).json({ message: "Success!", data: data.slice(0, 3) });

  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
};
