export default async function handler(req, res) {
    const { data, key } = req.query;

    // 1. Validation: Key 'AB-QR-' se shuru honi chahiye
    if (!key || !key.startsWith("AB-QR-")) {
        return res.status(401).json({ error: "Invalid Key! Generate from api.html" });
    }

    // 2. Data check
    if (!data) {
        return res.status(400).json({ error: "Data parameter is missing!" });
    }

    try {
        // High Quality QR Source (Google Charts)
        const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=400x400&chl=${encodeURIComponent(data)}&choe=UTF-8&chld=H|1`;
        
        const response = await fetch(qrUrl);

        if (!response.ok) {
            return res.status(500).json({ error: "Failed to fetch QR from engine" });
        }

        // Buffer mein convert karke bhej rahe hain
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Headers set kar rahe hain taake browser broken na dikhaye
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Length', buffer.length);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

        return res.send(buffer);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
