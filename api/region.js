const fetch = require("node-fetch");

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const API_URL = `https://app.beekeys.com/nigeria/wp-json/geodir/v2/locations/regions/?consumer_key=${process.env.NG_API_KEY}&consumer_secret=${process.env.NG_API_SECRET}`;

    const response = await fetch(API_URL);
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      throw new Error(`Upstream error ${response.status}`);
    }

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid content-type from Beekeys API");
    }

    const json = await response.json();
    console.log("API response:", json);

    // Check if json is an array or an object with data array
    let dataArray;
    if (Array.isArray(json)) {
      dataArray = json;
    } else if (Array.isArray(json.data)) {
      dataArray = json.data;
    } else {
      throw new Error("Unexpected API format: expected array or data array");
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      message: "Success!",
      data: dataArray.slice(0, 3),
    });
  } catch (error) {
    console.error("API Proxy Error:", error.message);
    res.status(500).json({
      message: "Error fetching data",
      error: error.message,
    });
  }
};
