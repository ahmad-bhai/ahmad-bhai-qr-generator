export default async function handler(req, res) {
    const { data, key, type } = req.query;

    if (!data || !key) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    try {
        // High Quality QR Source
        const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(data)}&choe=UTF-8&chld=H|1`;
        
        const response = await fetch(qrUrl);
        const buffer = await response.arrayBuffer();

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'public, max-age=86400');

        return res.send(Buffer.from(buffer));
    } catch (error) {
        return res.status(500).json({ error: 'QR Generation failed' });
    }
}
