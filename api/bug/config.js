module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const key = req.headers['x-api-key'];
  if (key !== 'boomer_secret_key_2025') {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  res.json({
    ok: true,
    config: {
      crash: true,
      multi: true,
      fast: true,
      anti: true,
      aimbot: false,
      wallhack: false,
      speedhack: false,
      godmode: false
    }
  });
};
