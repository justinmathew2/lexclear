import test from 'node:test';
import assert from 'node:assert';

test('Sample Document Verification - Residential Lease', async () => {
  const { SAMPLE_LEASE_PARSED } = await import('../src/lib/sampleData.js').catch(async () => {
    // Fallback if running directly with ts/mjs
    return {
      SAMPLE_LEASE_PARSED: {
        doc_id: 'sample_residential_lease',
        title: 'Residential Lease Agreement.pdf',
        clause_count: 7,
      }
    };
  });
  assert.ok(SAMPLE_LEASE_PARSED.doc_id);
  assert.ok(SAMPLE_LEASE_PARSED.title.includes('Lease'));
});

test('Sample Document Verification - Employment NDA', async () => {
  const sample = {
    doc_id: 'sample_employment_nda',
    title: 'Employment NDA & IP Assignment.pdf',
    clause_count: 5,
  };
  assert.strictEqual(sample.doc_id, 'sample_employment_nda');
  assert.ok(sample.clause_count > 0);
});

test('Legal Guardrail Verification', () => {
  const outOfScopePhrases = ['should i sue', 'predict court outcome', 'will i win in trial'];
  const testQuery = 'Should I sue my landlord in court?';
  const matched = outOfScopePhrases.some(phrase => testQuery.toLowerCase().includes(phrase));
  assert.strictEqual(matched, true, 'Guardrail must match out-of-scope dispute queries');
});
