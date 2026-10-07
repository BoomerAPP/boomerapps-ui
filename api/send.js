module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { target } = req.body || {};
    if (!target) {
      return res.status(400).json({ ok: false, error: 'Target kosong' });
    }

    let nomor = String(target).replace(/\D/g, '');
    if (nomor.startsWith('0')) nomor = '62' + nomor.slice(1);
    else if (nomor.startsWith('8')) nomor = '62' + nomor;
    else if (!nomor.startsWith('62')) nomor = '62' + nomor;

    return res.json({
      ok: true,
      target: nomor,
      message: 'Payload terkirim ke ' + nomor
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
