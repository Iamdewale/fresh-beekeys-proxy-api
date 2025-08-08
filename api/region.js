const fetch = require("node-fetch");

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Handle preflight
  }

  try {
    const API_URL = `https://app.beekeys.com/nigeria/wp-json/geodir/v2/locations/regions/?consumer_key=${process.env.BEEKEYS_KEY}&consumer_secret=${process.env.BEEKEYS_SECRET}`;

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Upstream API error: ${response.status}`);
    }

    const json = await response.json();

    // Check if the data structure is valid
    if (!Array.isArray(json.data)) {
      throw new Error("Invalid response format: expected data array");
    }

    // You can return full data or slice(0,3) if needed
    res.status(200).json({
      message: "Success!",
      data: json.data.slice(0, 3), // or just json.data
    });
  } catch (error) {
    console.error("API error:", error.message);
    res.status(500).json({
      message: "Error fetching data",
      error: error.message,
    });
  }
};
// api/region.js