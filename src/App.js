import React, { useState } from 'react';
import './App.css';
import { LoggerProvider, useLogger } from './logger';
import { genCode } from './urlHelper';

function Core() {
  const { log, logs } = useLogger();
  const [urls, setUrls] = useState([]);
  const [inputUrl, setInputUrl] = useState('');
  const [mins, setMins] = useState('');
  const [error, setError] = useState('');

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) {
      setError('Please enter a URL.');
      return;
    }
    if (!isValidUrl(inputUrl)) {
      setError('Invalid URL format.');
      return;
    }
    if (mins && (isNaN(mins) || parseInt(mins) <= 0)) {
      setError('Validity must be a positive number.');
      return;
    }

    const code = genCode();
    const validity = mins ? parseInt(mins, 10) : 30;
    const expiresAt = Date.now() + validity * 60000;
    setUrls((u) => [...u, { code, inputUrl, expiresAt, clicks: 0 }]);
    log(`shortened ${inputUrl} -> ${code}`);
    setInputUrl('');
    setMins('');
    setError('');
  };

  const click = (code) => {
    setUrls((u) =>
      u.map((x) => (x.code === code ? { ...x, clicks: x.clicks + 1 } : x))
    );
    log(`clicked ${code}`);
  };

  return (
    <main>
      <h2>URL Shortener</h2>
      <form onSubmit={submit}>
        <input
          type="url"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Enter long url"
          required
        />
        <input
          type="number"
          value={mins}
          onChange={(e) => setMins(e.target.value)}
          placeholder="validation time(min)"
        />
        <button>Shorten the link</button>
      </form>

      {error && <p className="error">{error}</p>}

      <section>
        {urls.map((u) => (
          <div key={u.code}>
            <button onClick={() => click(u.code)}>
              {window.location.origin}/{u.code}
            </button>
            <div>{u.clicks} clicks</div>
            <div>valid till {new Date(u.expiresAt).toLocaleTimeString()}</div>
          </div>
        ))}
      </section>

      <h3>log</h3>
      <ul>{logs.map((l, i) => <li key={i}>{l}</li>)}</ul>
    </main>
  );
}

export default function App() {
  return (
    <LoggerProvider>
      <Core />
    </LoggerProvider>
  );
}