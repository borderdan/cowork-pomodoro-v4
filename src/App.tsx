import { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Timer } from './components/Timer';
import { SettingsPanel } from './components/SettingsPanel';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center p-4 relative">
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-6 right-6 p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors"
        aria-label="Open settings"
      >
        <SettingsIcon size={28} />
      </button>

      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-indigo-900 tracking-tight">Pomodoro Timer</h1>
        <p className="text-indigo-600 mt-2 font-medium">Stay focused and productive</p>
      </header>

      <main className="w-full">
        <Timer />
      </main>

      <footer className="mt-16 text-gray-400 text-sm">
        <p>Built with Vite, React 18, and Tailwind CSS</p>
      </footer>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
