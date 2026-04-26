export default async function handler(req, res) {
    const { data, key } = req.query;

    // 1. Key check (Aapka Signature)
    if (!key || !key.startsWith("AB-QR-")) {
        return res.status(401).json({ error: "Invalid Key! Get it from api.html" });
    }

    // 2. Data check
    if (!data) {
        return res.status(400).json({ error: "Data is empty!" });
    }

    try {
        // High Quality QR Source
        const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=400x400&chl=${encodeURIComponent(data)}&choe=UTF-8&chld=H|1`;
        
        const response = await fetch(qrUrl);

        if (!response.ok) throw new Error('QR Engine unreachable');

        // ReadableStream ko arrayBuffer mein convert karna 
        const arrayBuffer = await response.arrayBuffer();
        const finalBuffer = Buffer.from(arrayBuffer);

        // STABLE HEADERS
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        
        // Final Response
        return res.status(200).send(finalBuffer);

    } catch (error) {
        return res.status(500).json({ error: "Server Error: " + error.message });
    }
}
