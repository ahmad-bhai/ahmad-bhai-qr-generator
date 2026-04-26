export default async function handler(req, res) {
    const { data, key } = req.query;

    // Demo keys jo humne api.html mein allow ki hain
    const ALLOWED_KEYS = ["AB-QR-XEIO5O", "MAGIC-QR-2026", "GUEST-KEY"];

    // 1. Validation check
    if (!data) {
        return res.status(400).json({ error: 'Data is empty! Add &data=YOUR_TEXT' });
    }

    if (!key || !ALLOWED_KEYS.includes(key)) {
        return res.status(401).json({ error: 'Invalid API Key! Generate a new one from api.html' });
    }

    try {
        // High Quality Google Chart API
        const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(data)}&choe=UTF-8&chld=H|1`;
        
        const response = await fetch(qrUrl);
        
        if (!response.ok) throw new Error('Source API Error');

        const buffer = await response.arrayBuffer();

        // Image headers
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'public, max-age=86400');

        return res.send(Buffer.from(buffer));

    } catch (error) {
        return res.status(500).json({ error: 'QR Generation failed: ' + error.message });
    }
}
