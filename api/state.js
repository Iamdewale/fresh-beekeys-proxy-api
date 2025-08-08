export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: "Missing slug" });
  }

  try {
    const response = await fetch(
      `https://app.beekeys.com/nigeria/wp-json/geodir/v2/locations/regions/${slug}?country=nigeria`
    );

    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*"); // Optional if needed
    res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error.message);
    res.status(500).json({ error: "Proxy failed" });
  }
}
