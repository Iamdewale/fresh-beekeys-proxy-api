const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const { slug } = req.query;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (!slug) return res.status(400).json({ error: "Missing slug" });

  try {
    const url = `https://app.beekeys.com/nigeria/wp-json/geodir/v2/locations/regions/${slug}?country=nigeria&consumer_key=${process.env.NG_KEY}&consumer_secret=${process.env.NG_SECRET}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || !data) {
      throw new Error("Invalid response from Beekeys API");
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy failed", detail: error.message });
  }
};
