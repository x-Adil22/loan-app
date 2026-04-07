import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import LoanForm from './components/LoanForm';
import ResultDashboard from './components/ResultDashboard';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handlePredict = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction');
      }

      const data = await response.json();
      setPredictionResult(data);
      
      // Scroll to result smoothly
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred. Check if the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-primary-500/30">
              L
            </div>
            <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">
              LoanIntel AI
            </h1>
          </motion.div>
          
          <button 
            onClick={toggleDarkMode}
            className="p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors glass border-none"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-6 h-6 text-amber-400" /> : <Moon className="w-6 h-6 text-indigo-600" />}
          </button>
        </header>

        <main className="space-y-16">
          <Hero />
          
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12 items-start" id="form-section">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <LoanForm onSubmit={handlePredict} isLoading={isLoading} />
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 rounded-2xl shadow-sm"
                >
                  <p className="font-medium">Error</p>
                  <p className="text-sm opacity-90">{error}</p>
                </motion.div>
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              id="result-section"
            >
              {predictionResult ? (
                <ResultDashboard result={predictionResult} />
              ) : (
                <div className="h-full min-h-[500px] glass rounded-3xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-8 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-indigo-600/5 group-hover:from-primary-500/10 group-hover:to-indigo-600/10 transition-colors"></div>
                  <div className="w-24 h-24 mb-8 rounded-full border-[6px] border-dashed border-slate-200 dark:border-slate-800 animate-[spin_12s_linear_infinite]" />
                  <h3 className="text-xl font-semibold mb-2 text-slate-700 dark:text-slate-300">Awaiting Profile Details...</h3>
                  <p className="text-sm max-w-[250px]">Complete the application form on the left to instantly receive an AI-powered prediction with a complete breakdown.</p>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
