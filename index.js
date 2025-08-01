import { useState } from 'react';

export default function Home() {
  const [entry, setEntry] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entry })
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Blindspot</h1>
      <textarea rows={6} style={{ width: '100%' }} value={entry} onChange={e => setEntry(e.target.value)} />
      <br />
      <button onClick={analyze} disabled={loading}>{loading ? 'Analyzing...' : 'Analyze Entry'}</button>
      {result && (
        <div style={{ marginTop: 20 }}>
          <p><strong>Ticker:</strong> {result.ticker}</p>
          <p><strong>Bias Score:</strong> {result.bias_score}</p>
          <p><strong>Conviction:</strong> {result.conviction}</p>
          <p><strong>Summary:</strong> {result.summary}</p>
        </div>
      )}
    </main>
  );
}