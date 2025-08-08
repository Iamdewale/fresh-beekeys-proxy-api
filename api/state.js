export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: "Missing slug" });
  }

  try {
    const response = await fetch(
      `https://app.beekeys.com/nigeria/wp-json/geodir/v2/locations/regions/${slug}?country=nigeria`
    );

    const contentType = response.headers.get("content-type");

    // If response isn't JSON (e.g., HTML error), show it safely
    if (!contentType || !contentType.includes("application/json")) {
      const raw = await response.text();
      return res.status(502).json({
        error: "Invalid response from upstream server",
        detail: raw.slice(0, 300) + "...", // for debugging
      });
    }

    const data = await response.json();

    // Optional CORS header for localhost (not needed on Vercel)
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error.message);
    res.status(500).json({ error: "Proxy failed", message: error.message });
  }
}
