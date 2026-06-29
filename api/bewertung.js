module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { strasse, plz, objektart, wohnflaeche, grundstueck, stockwerke, email, telefon } = req.body || {};

  if (!strasse || !plz || !objektart || !wohnflaeche || !email) {
    res.status(400).json({ error: 'Pflichtfelder fehlen' });
    return;
  }

  const scriptUrl = process.env.APPS_SCRIPT_URL;
  if (!scriptUrl) {
    console.error('APPS_SCRIPT_URL ist nicht gesetzt');
    res.status(500).json({ error: 'Internal error' });
    return;
  }

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ strasse, plz, objektart, wohnflaeche, grundstueck, stockwerke, email, telefon })
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result || result.ok !== true) {
      console.error('Apps Script lieferte einen Fehler:', result);
      res.status(502).json({ error: 'Upstream error' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Bewertungsanfrage konnte nicht gespeichert werden:', err);
    res.status(500).json({ error: 'Internal error' });
  }
};
