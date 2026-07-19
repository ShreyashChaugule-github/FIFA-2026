import test from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '../app/api/gemini/route.js';

test('API POST returns 400 when content-type is not application/json', async () => {
  const req = new Request('http://localhost/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: 'hello',
  });

  const res = await POST(req);
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.match(data.error, /Content-Type/i);
});

test('API POST returns 400 when JSON body is invalid', async () => {
  const req = new Request('http://localhost/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: 'not a json',
  });

  const res = await POST(req);
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.match(data.error, /Invalid JSON/i);
});

test('API POST returns 400 when message is missing', async () => {
  const req = new Request('http://localhost/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ context: 'fan' }),
  });

  const res = await POST(req);
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.match(data.error, /required/i);
});

test('API POST returns 400 when message is too long', async () => {
  const req = new Request('http://localhost/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'a'.repeat(401) }),
  });

  const res = await POST(req);
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.match(data.error, /fewer/i);
});

test('API POST returns 200 with Demo Mode response when GEMINI_API_KEY is not set', async () => {
  const originalKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;

  try {
    const req = new Request('http://localhost/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Where is the match?' }),
    });

    const res = await POST(req);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.match(data.response, /DEMO MODE/i);
  } finally {
    if (originalKey) {
      process.env.GEMINI_API_KEY = originalKey;
    }
  }
});
