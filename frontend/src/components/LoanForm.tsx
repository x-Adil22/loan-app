import { useState } from 'react';
import { Info } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoanForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void, isLoading: boolean }) {
  const [formData, setFormData] = useState({
    Age: 35,
    Income: 65000,
    Credit_Score: 720,
    Loan_Amount: 20000,
    Employment_Status: 2,
    Previous_Defaults: 0
  });

  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const formFields = [
    { name: 'Age', label: 'Age', type: 'number', min: 18, max: 100, step: 1, tooltip: 'Your age.' },
    { name: 'Income', label: 'Annual Income ($)', type: 'number', min: 0, step: 1000, tooltip: 'Higher income generally increases approval odds.' },
    { name: 'Credit_Score', label: 'Credit Score', type: 'number', min: 300, max: 850, step: 1, tooltip: 'Essential metric of past credit behavior.' },
    { name: 'Loan_Amount', label: 'Loan Amount ($)', type: 'number', min: 0, step: 1000, tooltip: 'The total capital you are requesting.' }
  ];

  return (
    <div className="glass rounded-3xl p-6 md:p-8 relative">
      <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Applicant Profile</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {formFields.map(field => (
            <div key={field.name} className="relative group/field">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {field.label}
                <button 
                  type="button" 
                  className="text-slate-400 hover:text-primary-500 transition-colors"
                  onMouseEnter={() => setActiveTooltip(field.name)}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  <Info className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {activeTooltip === field.name && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-slate-800 text-white text-xs rounded-xl shadow-xl z-10 pointer-events-none"
                    >
                      {field.tooltip}
                    </motion.div>
                  )}
                </AnimatePresence>
              </label>
              <input
                type={field.type}
                name={field.name}
                min={field.min}
                max={field.max}
                step={field.step}
                value={(formData as any)[field.name]}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-primary-500 dark:focus:border-primary-500 rounded-xl outline-none transition-all placeholder:text-slate-400 dark:text-white shadow-sm focus:ring-4 focus:ring-primary-500/10"
              />
            </div>
          ))}

          <div className="relative group/field">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Employment Status
            </label>
            <select
              name="Employment_Status"
              value={formData.Employment_Status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-primary-500 dark:focus:border-primary-500 rounded-xl outline-none transition-all dark:text-white shadow-sm focus:ring-4 focus:ring-primary-500/10 appearance-none"
            >
              <option value={0}>Unemployed</option>
              <option value={1}>Part-time</option>
              <option value={2}>Full-time</option>
              <option value={3}>Self-employed</option>
            </select>
          </div>

          <div className="relative group/field">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Previous Defaults
            </label>
            <select
              name="Previous_Defaults"
              value={formData.Previous_Defaults}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-primary-500 dark:focus:border-primary-500 rounded-xl outline-none transition-all dark:text-white shadow-sm focus:ring-4 focus:ring-primary-500/10 appearance-none"
            >
              <option value={0}>No (0 defaults)</option>
              <option value={1}>Yes (1+ defaults)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={clsx(
            "w-full py-4 mt-8 rounded-xl font-bold text-white text-lg transition-all shadow-xl",
            isLoading 
              ? "bg-slate-400 dark:bg-slate-700 cursor-not-allowed" 
              : "bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 hover:shadow-primary-500/25 active:scale-[0.98]"
          )}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Profile...
            </span>
          ) : "Check Eligibility & AI Explanation"}
        </button>
      </form>
    </div>
  );
}
