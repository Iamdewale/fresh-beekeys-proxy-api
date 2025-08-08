const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const { slug } = req.query;

  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle CORS preflight
  if (req.method === "OPTIONS") return res.status(200).end();

  if (!slug) return res.status(400).json({ error: "Missing slug" });

  try {
    const url = `https://app.beekeys.com/nigeria/wp-json/geodir/v2/locations/regions/${slug}?country=nigeria&consumer_key=${process.env.NG_API_KEY}&consumer_secret=${process.env.NG_API_SECRET}`;

    const response = await fetch(url);
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      throw new Error(`Upstream error: ${response.status}`);
    }

    if (!contentType || !contentType.includes("application/json")) {
      const fallback = await response.text();
      throw new Error("Invalid content-type from Beekeys: " + fallback.slice(0, 100));
    }

    const data = await response.json();

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(data);
  } catch (error) {
    console.error("API Proxy Error:", error.message);
    res.status(500).json({
      error: "Proxy failed",
      detail: error.message,
    });
  }
};
