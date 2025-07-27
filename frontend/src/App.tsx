import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    };
  }
}

export default function App() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      setReady(true);
    }
  }, []);

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Food-Truck Fleet</h1>
      {ready ? <p>Telegram WebApp initialized.</p> : <p>Loading...</p>}
    </div>
  );
}
