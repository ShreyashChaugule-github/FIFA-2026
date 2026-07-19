import { describe, it, expect } from 'vitest';
import { validateRequestInput, buildPrompt } from '@/lib/gemini';

describe('Gemini Lib', () => {
  describe('validateRequestInput', () => {
    it('should validate standard fan request', () => {
      const input = { message: 'Where is gate A?', context: 'fan', language: 'en', type: 'general' };
      const res = validateRequestInput(input);
      expect(res.valid).toBe(true);
      expect(res.value.message).toBe('Where is gate A?');
    });

    it('should sanitize long messages', () => {
      const longMsg = 'A'.repeat(500);
      const res = validateRequestInput({ message: longMsg, context: 'fan' });
      expect(res.valid).toBe(true);
      expect(res.value.message.length).toBeLessThan(401);
    });

    it('should reject missing message', () => {
      const res = validateRequestInput({ context: 'fan' });
      expect(res.valid).toBe(false);
      expect(res.error).toContain('required');
    });

    it('should default to fan context if invalid', () => {
      const res = validateRequestInput({ message: 'Hello', context: 'hacker' });
      expect(res.valid).toBe(true);
      expect(res.value.context).toBe('fan');
    });
  });

  describe('buildPrompt', () => {
    it('should contain stadium context', () => {
      const prompt = buildPrompt({ message: 'Hello', context: 'fan', language: 'en', type: 'general' });
      expect(prompt).toContain('FIFA World Cup 2026');
    });

    it('should vary prompt by context', () => {
      const fan = buildPrompt({ message: 'Hi', context: 'fan', language: 'en', type: 'general' });
      const staff = buildPrompt({ message: 'Hi', context: 'staff', language: 'en', type: 'general' });
      expect(fan).not.toEqual(staff);
      expect(staff).toContain('stadium staff');
    });
  });
});
