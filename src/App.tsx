import { Timer } from './components/Timer';

function App() {
  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center p-4">
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
    </div>
  );
}

export default App;
