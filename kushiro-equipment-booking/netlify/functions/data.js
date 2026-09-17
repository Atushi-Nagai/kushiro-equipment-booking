const { getStore } = require('@netlify/blobs');

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=utf-8'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: HEADERS, body: '' };
  }

  const store = getStore({
    name: 'kushiro-equipment-store',
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_BLOBS_TOKEN
  });

  if (event.httpMethod === 'GET') {
    const value = await store.get('app-data', { type: 'json' });
    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify(value || { equipment: [], reservations: [] })
    };
  }

  if (event.httpMethod === 'POST') {
    let payload;
    try {
      payload = JSON.parse(event.body || '{}');
    } catch (e) {
      return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: 'invalid json' }) };
    }
    await store.setJSON('app-data', payload);
    return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error: 'method not allowed' }) };
};

  return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error: 'method not allowed' }) };
};
