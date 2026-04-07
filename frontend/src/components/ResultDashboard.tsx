import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Activity, ShieldCheck } from 'lucide-react';
import ShapChart from './ShapChart';
import clsx from 'clsx';

export default function ResultDashboard({ result }: { result: any }) {
  const isApproved = result.prediction === 'Approved';
  const probability = (result.probability * 100).toFixed(1);

  return (
    <div className="glass rounded-3xl p-6 md:p-8 relative overflow-hidden h-full flex flex-col">
      {/* Decorative background glow based on result */}
      <div className={clsx(
        "absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000",
        isApproved ? "bg-emerald-500" : "bg-red-500"
      )} />

      <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
        <Activity className="w-6 h-6 text-primary-500" />
        AI Verification
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 text-center sm:text-left">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={clsx(
            "w-24 h-24 rounded-full flex items-center justify-center shadow-2xl flex-shrink-0 relative",
            isApproved 
              ? "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/30 text-white" 
              : "bg-gradient-to-br from-red-400 to-red-600 shadow-red-500/30 text-white"
          )}
        >
          <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
          {isApproved ? <CheckCircle className="w-12 h-12 relative z-10" /> : <XCircle className="w-12 h-12 relative z-10" />}
        </motion.div>
        
        <div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</p>
          <h4 className={clsx(
            "text-4xl font-black mb-2 tracking-tight",
            isApproved ? "text-emerald-500 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
          )}>
            {result.prediction}
          </h4>
          <p className="text-slate-600 dark:text-slate-300">
            Confidence score: <span className="font-bold">{probability}%</span>
          </p>
        </div>
      </div>

      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-4 mb-2 overflow-hidden shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${probability}%` }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
          className={clsx(
            "h-4 rounded-full relative overflow-hidden",
            isApproved ? "bg-emerald-500" : "bg-red-500"
          )}
        >
           <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
        </motion.div>
      </div>
      <div className="flex justify-between text-xs text-slate-500 mb-10 px-1 font-medium">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>

      <div className="space-y-4 flex-1">
        <h4 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary-500" />
          Why this decision?
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
          The chart below represents the Explainable AI (SHAP) feature importance for your specific profile. Green indicates factors pushing towards approval; red indicates factors pushing towards rejection.
        </p>
        
        <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-4 shadow-sm">
          <ShapChart shapData={result.shap_values} />
        </div>
      </div>
    </div>
  );
}
