const fetch = require("node-fetch");

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const API_URL = `https://app.beekeys.com/nigeria/wp-json/geodir/v2/locations/regions/?consumer_key=${process.env.BEEKEYS_KEY}&consumer_secret=${process.env.BEEKEYS_SECRET}`;

    const response = await fetch(API_URL);
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      throw new Error(`Upstream error ${response.status}`);
    }

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid content-type from Beekeys API");
    }

    const json = await response.json();

    if (!Array.isArray(json.data)) {
      throw new Error("Unexpected API format: expected 'data' array");
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      message: "Success!",
      data: json.data.slice(0, 3), // ✅ or remove slice to get all
    });
  } catch (error) {
    console.error("API Proxy Error:", error.message);
    res.status(500).json({
      message: "Error fetching data",
      error: error.message,
    });
  }
};
