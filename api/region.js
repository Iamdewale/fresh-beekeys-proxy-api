const fetch = require("node-fetch");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (!process.env.NG_API_KEY || !process.env.NG_API_SECRET) {
      throw new Error("Missing API keys");
    }

    const API_URL = `https://app.beekeys.com/nigeria/wp-json/geodir/v2/locations/regions/?consumer_key=${process.env.NG_API_KEY}&consumer_secret=${process.env.NG_API_SECRET}`;
    console.log("Fetching from Beekeys API:", API_URL);

    const response = await fetch(API_URL);
    console.log("Response status:", response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error("API returned error:", text);
      throw new Error(`Upstream error ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Invalid content type response:", text);
      throw new Error("Invalid content-type from Beekeys API");
    }

    const json = await response.json();
    console.log("API response json:", json);

    const dataArray = Array.isArray(json) ? json : json.data;
    if (!Array.isArray(dataArray)) {
      throw new Error("Unexpected API format: expected array");
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ message: "Success!", data: dataArray.slice(0, 3) });
  } catch (error) {
    console.error("API Proxy Error:", error.message);
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
};
