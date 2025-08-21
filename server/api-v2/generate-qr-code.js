import cors from 'cors';
import QRCode from 'qrcode';

export default async function handler(req, res) {
  cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' })(req, res, async () => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    try {
      const { text, format } = req.body;
      if (!text) return res.status(400).json({ success: false, error: 'Texto ou URL é obrigatório' });
      const supported = ['png', 'svg'];
      if (!format || !supported.includes(format.toLowerCase())) {
        return res.status(400).json({ success: false, error: `Formato não suportado: ${format}. Use png ou svg.` });
      }
      if (format.toLowerCase() === 'svg') {
        const svg = await QRCode.toString(text, { type: 'svg' });
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
      } else {
        const buffer = await QRCode.toBuffer(text, { type: 'png' });
        res.set('Content-Type', 'image/png');
        res.send(buffer);
      }
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      res.status(500).json({ success: false, error: 'Erro interno ao gerar QR Code', details: error.message });
    }
  });
}


