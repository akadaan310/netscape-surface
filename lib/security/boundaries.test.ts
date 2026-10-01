import { describe, it, expect } from 'vitest';
import { sanitizeUrl, assertNoSecretsInText } from './boundaries';

describe('security boundaries', () => {
  it('sanitizeUrl accepts https and trims', () => {
    expect(sanitizeUrl('  https://nasa.gov/mars  ')).toBe('https://nasa.gov/mars');
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
  });

  it('sanitizeUrl returns null for javascript:, data:, file:, vbscript: and non-http schemes', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBeNull();
    expect(sanitizeUrl('  JaVaScRiPt:alert(1)')).toBeNull();
    expect(sanitizeUrl('data:text/html,<h1>x</h1>')).toBeNull();
    expect(sanitizeUrl('file:///etc/passwd')).toBeNull();
    expect(sanitizeUrl('vbscript:msgbox(1)')).toBeNull();
    expect(sanitizeUrl('ftp://example.com/x')).toBeNull();
    expect(sanitizeUrl('')).toBeNull();
    expect(sanitizeUrl('not a url')).toBeNull();
  });

  it('assertNoSecretsInText flags a fake key', () => {
    const hits = assertNoSecretsInText('const x = { api_key: "sk-live-1234567890" };');
    expect(hits).toHaveLength(1);
    expect(hits[0]).toContain('api_key');

    const hits2 = assertNoSecretsInText('password: "hunter2-hunter2" and token = "abcd12345678"');
    expect(hits2).toHaveLength(2);
  });

  it('assertNoSecretsInText passes DEMO_KEY usage and clean text', () => {
    expect(assertNoSecretsInText('api_key: "DEMO_KEY"')).toHaveLength(0);
    expect(assertNoSecretsInText('const token: "DEMO_KEY_PLACEHOLDER"')).toHaveLength(0);
    expect(assertNoSecretsInText('no secrets here at all')).toHaveLength(0);
  });

  it('assertNoSecretsInText honors the allowlist', () => {
    const hits = assertNoSecretsInText('secret: "MY_TEST_SECRET_123"', ['MY_TEST_SECRET_123']);
    expect(hits).toHaveLength(0);
  });
});
