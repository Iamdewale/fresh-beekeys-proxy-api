
// const fetch = require('node-fetch');

// module.exports = async (req, res) => {
//   console.log("Endpoint hit");

//   try {
//     const API_URL = `https://app.beekeys.com/nigeria/wp-json/geodir/v2/locations/regions/?consumer_key=${process.env.BEEKEYS_KEY}&consumer_secret=${process.env.BEEKEYS_SECRET}`;
//     const response = await fetch(API_URL);
    
//     console.log("Fetch response status:", response.status);
//     const data = await response.json();
//     console.log("API response data:", data);

//     if (!Array.isArray(data)) {
//       throw new Error("Response data is not an array");
//     }

//     res.status(200).json({ message: "Success!", data: data.slice(0, 3) });

//   } catch (error) {
//     console.log("Error:", error.message);
//     res.status(500).json({ message: "Error fetching data", error: error.message });
//   }
// };

const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const API_URL = `https://app.beekeys.com/nigeria/wp-json/geodir/v2/locations/regions/?consumer_key=${process.env.BEEKEYS_KEY}&consumer_secret=${process.env.BEEKEYS_SECRET}`;
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Response data is not an array");
    }

    res.status(200).json({ message: "Success!", data: data.slice(0, 3) });
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
};
// Note: Ensure that the environment variables BEEKEYS_KEY and BEEKEYS_SECRET are set correctly in your environment.
// This code handles CORS and preflight requests, allowing the API to be accessed from different