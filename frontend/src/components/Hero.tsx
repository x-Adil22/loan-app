import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

export default function Hero() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8 max-w-4xl mx-auto py-12"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-semibold text-primary-600 dark:text-primary-400 mb-4 shadow-sm border border-primary-200/50 dark:border-primary-900/30">
        <Target className="w-4 h-4" />
        Powered by Explainable AI
      </div>
      <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
        Instant decisions with <br className="hidden md:block"/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-500 dark:from-primary-400 dark:to-indigo-400 relative">
          complete transparency
          <div className="absolute -bottom-2 left-0 right-0 h-3 bg-primary-500/20 blur-xl"></div>
        </span>.
      </h2>
      <p className="text-lg md:text-2xl font-medium text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
        Our advanced machine learning model analyzes your financial profile in seconds—not only delivering a verdict, but explaining exactly why.
      </p>
    </motion.section>
  );
}
