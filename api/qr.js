export default async function handler(req, res) {
    const { data, key, type } = req.query;

    // 1. Dynamic Key Validation (Ahmad Bhai's Signature Logic)
    if (!key || !key.startsWith("AB-QR-")) {
        return res.status(401).json({ 
            error: "Invalid API Key! Please generate your official key from api.html",
            owner: "Ahmad Bhai Scripts"
        });
    }

    if (!data) return res.status(400).json({ error: "Data is required! Usage: &data=your_link" });

    // 2. Permission System (Block unwanted content if needed)
    const blockedKeywords = ["scam", "phishing", "illegal-site"]; 
    if (blockedKeywords.some(word => data.toLowerCase().includes(word))) {
        return res.status(403).json({ error: "Content not allowed by Ahmad Bhai Security Policy" });
    }

    try {
        // High Resolution QR Engine
        const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=400x400&chl=${encodeURIComponent(data)}&choe=UTF-8&chld=H|1`;
        
        const response = await fetch(qrUrl);
        const buffer = await response.arrayBuffer();

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // Fast Loading

        return res.send(Buffer.from(buffer));
    } catch (e) {
        return res.status(500).json({ error: "Server error in QR Engine" });
    }
}
