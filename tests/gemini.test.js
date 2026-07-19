import test from 'node:test';
import assert from 'node:assert/strict';
import { validateRequestInput, buildPrompt } from '../lib/gemini.js';

test('rejects empty messages', () => {
  const result = validateRequestInput({ message: '   ' });

  assert.equal(result.valid, false);
  assert.match(result.error, /required/i);
});

test('normalizes context, language, and type', () => {
  const result = validateRequestInput({
    message: 'Where is the nearest exit?',
    context: 'STAFF',
    language: 'ES',
    type: 'NAVIGATION',
  });

  assert.equal(result.valid, true);
  assert.equal(result.value.context, 'staff');
  assert.equal(result.value.language, 'es');
  assert.equal(result.value.type, 'navigation');
});

test('buildPrompt includes normalized instructions', () => {
  const prompt = buildPrompt({
    message: 'Help me reach gate A',
    context: 'fan',
    language: 'en',
    type: 'wayfinding',
  });

  assert.match(prompt, /USER ROLE: fan/);
  assert.match(prompt, /REQUEST TYPE: wayfinding/);
  assert.match(prompt, /Help me reach gate A/);
});

test('buildPrompt strengthens safety guidance for operational requests', () => {
  const prompt = buildPrompt({
    message: 'Need urgent assistance near a spill',
    context: 'staff',
    language: 'en',
    type: 'incident',
  });

  assert.match(prompt, /SAFETY PRIORITY/i);
  assert.match(prompt, /actionable/i);
});
