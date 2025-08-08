const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const { slug } = req.query;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (!slug) return res.status(400).json({ error: "Missing slug" });

  try {
    const url = `https://app.beekeys.com/nigeria/wp-json/geodir/v2/locations/regions/${slug}?country=nigeria&consumer_key=${process.env.NG_API_KEY}&consumer_secret=${process.env.NG_API_SECRET}`;

    const response = await fetch(url);

    const contentType = response.headers.get("content-type") || "";

    // Check for JSON content-type before parsing
    if (!contentType.includes("application/json")) {
      const text = await response.text();
      console.error(`Unexpected content-type from Beekeys API: ${contentType}`);
      console.error("Response text:", text);
      throw new Error("Invalid content-type from Beekeys API");
    }

    const data = await response.json();

    if (!response.ok) {
      console.error("Beekeys API error:", data);
      throw new Error(`Beekeys API error: ${response.status}`);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error.message);
    res.status(500).json({ error: "Proxy failed", detail: error.message });
  }
};
