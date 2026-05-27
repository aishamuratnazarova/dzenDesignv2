import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const BriefWizard: React.FC = () => {
  const { showBrief, setShowBrief, language, setCursorState, t } = usePortfolio();

  const [step, setStep] = useState(1);
  const [services, setServices] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shakeField, setShakeField] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!showBrief) return null;

  // Directions services available
  const directions = [
    { id: 'saas', labelRu: 'SaaS Платформы', labelEn: 'SaaS Platforms', icon: '💻' },
    { id: 'mobile', labelRu: 'Мобильные продукты', labelEn: 'Mobile Apps', icon: '📱' },
    { id: 'website', labelRu: 'Сложные веб-сайты', labelEn: 'High-end Websites', icon: '🎨' },
    { id: 'system', labelRu: 'Дизайн-системы', labelEn: 'Design Systems', icon: '📐' },
    { id: 'branding', labelRu: 'Фирменный стиль', labelEn: 'Branding', icon: '⚡' },
  ];

  // Budget plates
  const budgets = [
    { id: 'small', labelRu: 'До 500k ₽', labelEn: 'Under $5,000' },
    { id: 'mid', labelRu: '500k – 1.5M ₽', labelEn: '$5,000 – $15,000' },
    { id: 'large', labelRu: 'От 1.5M ₽', labelEn: 'Over $15,000' },
  ];

  /* Service selecting toggler */
  const toggleService = (id: string) => {
    setServices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  /* Verification and navigation helpers */
  const handleNext = () => {
    if (step === 1 && services.length === 0) {
      triggerShake('services');
      return;
    }
    if (step === 2 && !budget) {
      triggerShake('budget');
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  const triggerShake = (fieldName: string) => {
    setShakeField(fieldName);
    setTimeout(() => setShakeField(null), 500);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = t('form.err.required');
    }
    if (!formData.email.trim()) {
      newErrors.email = t('form.err.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('form.err.email');
    }

    setErrors(newErrors);

    // If there are errors, trigger shake on the first faulty field
    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      triggerShake(firstErrorKey);
      return false;
    }
    return true;
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    // Simulate premium server API delivery sequence
    setTimeout(() => {
      setSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleClose = () => {
    setShowBrief(false);
    // reset form states
    setTimeout(() => {
      setStep(1);
      setServices([]);
      setBudget('');
      setFormData({ name: '', email: '', website: '', description: '' });
      setErrors({});
      setIsSuccess(false);
    }, 500);
  };

  const triggerHover = () => setCursorState({ type: 'hover' });
  const resetCursor = () => setCursorState({ type: 'default' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70 backdrop-blur-md overflow-y-auto px-4 py-8">
      {/* Dynamic shaking effect CSS inline rule wrapper */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .shake-element {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>

      {/* Primary Dialog Box */}
      <div className="bg-white dark:bg-[#0D0D11] rounded-3xl w-full max-w-2xl px-6 md:px-10 py-10 relative shadow-2xl overflow-hidden border border-neutral-200/50 dark:border-white/10 transition-colors duration-500 max-h-[90vh] overflow-y-auto select-none">
        
        {/* Close Button top floating right */}
        <button
          onClick={handleClose}
          onMouseEnter={triggerHover}
          onMouseLeave={resetCursor}
          className="absolute top-6 right-6 w-10 h-10 rounded-full border border-neutral-200 hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-white/5 text-neutral-500 hover:text-neutral-900 dark:text-white/60 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer"
          aria-label="Close brief wizard"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isSuccess ? (
          <div>
            {/* Header Steps Tracker */}
            <div className="flex gap-2 items-center mb-8">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center gap-1">
                  <span className={`w-6 h-6 rounded-full text-xs font-bold font-mono flex items-center justify-center transition-all duration-300 ${
                    step === num
                      ? 'bg-emerald-500 text-white dark:bg-[#00FF00] dark:text-black dark:shadow-[0_0_10px_#00FF00] shadow-md'
                      : step > num
                      ? 'bg-neutral-200 text-neutral-500 dark:bg-white/10 dark:text-white/40'
                      : 'border border-neutral-200 text-neutral-400 dark:border-white/10'
                  }`}>
                    {num}
                  </span>
                  {num < 3 && <span className="w-6 h-[1.5px] bg-neutral-200 dark:bg-white/5" />}
                </div>
              ))}
              <span className="text-[10px] tracking-wider uppercase font-mono text-neutral-400 dark:text-white/40 ml-4">
                Step {step} of 3
              </span>
            </div>

            {/* Title description layout */}
            <div className="mb-10">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-white capitalize leading-relaxed mb-2">
                {t('brief.title')}
              </h2>
              <p className="font-sans text-xs text-neutral-500 dark:text-white/40 font-normal">
                {t('brief.subtitle')}
              </p>
            </div>

            {/* STEP 1: Categories selecting */}
            {step === 1 && (
              <div className={`space-y-6 ${shakeField === 'services' ? 'shake-element' : ''}`}>
                <h3 className="font-display font-medium text-lg text-neutral-800 dark:text-neutral-100 leading-relaxed">
                  {t('brief.step1')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {directions.map((dir) => {
                    const isSelected = services.includes(dir.id);
                    return (
                      <div
                        key={dir.id}
                        onClick={() => toggleService(dir.id)}
                        onMouseEnter={triggerHover}
                        onMouseLeave={resetCursor}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-4 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/5 dark:border-[#00FF00] dark:bg-[#00FF00]/5 shadow-md shadow-emerald-500/5'
                            : 'border-neutral-200 hover:border-neutral-400 bg-white dark:bg-white/3 dark:border-white/5 dark:hover:border-white/10'
                        }`}
                      >
                        <span className="text-2xl">{dir.icon}</span>
                        <span className="font-sans text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                          {language === 'RU' ? dir.labelRu : dir.labelEn}
                        </span>
                        {isSelected && (
                          <span className="ml-auto w-5 h-5 rounded-full bg-emerald-500 dark:bg-[#00FF00] text-white dark:text-black flex items-center justify-center">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: Budget selection */}
            {step === 2 && (
              <div className={`space-y-6 ${shakeField === 'budget' ? 'shake-element' : ''}`}>
                <h3 className="font-display font-medium text-lg text-neutral-800 dark:text-neutral-100 leading-relaxed">
                  {t('brief.step2')}
                </h3>
                <div className="space-y-4">
                  {budgets.map((b) => {
                    const isSelected = budget === b.id;
                    return (
                      <div
                        key={b.id}
                        onClick={() => setBudget(b.id)}
                        onMouseEnter={triggerHover}
                        onMouseLeave={resetCursor}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-350 flex items-center gap-4 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/5 dark:border-[#00FF00] dark:bg-[#00FF00]/5 shadow'
                            : 'border-neutral-200 hover:border-neutral-400 bg-white dark:bg-white/3 dark:border-white/5 dark:hover:border-white/10'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-emerald-500 dark:border-[#00FF00]' : 'border-neutral-300 dark:border-white/10'
                        }`}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-[#00FF00]" />}
                        </div>
                        <span className="font-sans text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                          {language === 'RU' ? b.labelRu : b.labelEn}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: Context contact inputs */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="font-display font-medium text-lg text-neutral-800 dark:text-neutral-100 leading-relaxed">
                  {t('brief.step3')}
                </h3>
                
                {/* Text boxes with error shake animations if validated empty */}
                <div className="space-y-4">
                  {/* Name field */}
                  <div className={`relative ${shakeField === 'name' ? 'shake-element' : ''}`}>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormInputChange}
                      required
                      placeholder={t('form.name')}
                      className={`w-full px-5 py-4 bg-transparent outline-none rounded-2xl border-2 text-sm text-neutral-800 dark:text-neutral-100 transition-all ${
                        errors.name
                          ? 'border-red-500 focus:border-red-600 focus:ring-red-500/10'
                          : 'border-neutral-200 focus:border-neutral-900 dark:border-white/10 dark:focus:border-[#00FF00]'
                      }`}
                    />
                    {errors.name && (
                      <span className="text-[10px] text-red-500 font-mono mt-1 block px-2">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Email field */}
                  <div className={`relative ${shakeField === 'email' ? 'shake-element' : ''}`}>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormInputChange}
                      required
                      placeholder={t('form.email')}
                      className={`w-full px-5 py-4 bg-transparent outline-none rounded-2xl border-2 text-sm text-neutral-805 dark:text-neutral-100 transition-all ${
                        errors.email
                          ? 'border-red-500 focus:border-red-600 focus:ring-red-500/10'
                          : 'border-neutral-200 focus:border-neutral-900 dark:border-white/10 dark:focus:border-[#00FF00]'
                      }`}
                    />
                    {errors.email && (
                      <span className="text-[10px] text-red-500 font-mono mt-1 block px-2">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Reference website */}
                  <div>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleFormInputChange}
                      placeholder={t('form.website')}
                      className="w-full px-5 py-4 bg-transparent outline-none rounded-2xl border-2 text-sm text-neutral-805 dark:text-neutral-100 border-neutral-200 focus:border-neutral-900 dark:border-white/10 dark:focus:border-[#00FF00] transition-all"
                    />
                  </div>

                  {/* Task description */}
                  <div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormInputChange}
                      placeholder={t('form.desc')}
                      rows={4}
                      className="w-full px-5 py-4 bg-transparent outline-none rounded-2xl border-2 text-sm text-neutral-805 dark:text-neutral-100 border-neutral-200 focus:border-neutral-900 dark:border-white/10 dark:focus:border-[#00FF00] transition-all resize-none"
                    />
                  </div>
                </div>
              </form>
            )}

            {/* Wizard navigator bar */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-neutral-200 dark:border-white/5">
              {step > 1 ? (
                <button
                  onClick={handlePrev}
                  onMouseEnter={triggerHover}
                  onMouseLeave={resetCursor}
                  className="px-6 py-3 border border-neutral-300 rounded-full hover:bg-neutral-100 text-xs font-bold uppercase text-neutral-600 dark:border-white/10 dark:hover:bg-white/5 dark:text-white/60 transition-all cursor-pointer"
                >
                  {t('brief.prev')}
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  onClick={handleNext}
                  onMouseEnter={triggerHover}
                  onMouseLeave={resetCursor}
                  className="px-6 py-3 bg-neutral-900 text-white dark:bg-[#00FF00] dark:text-black font-sans text-xs font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-all cursor-pointer"
                >
                  {t('brief.next')}
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  onMouseEnter={triggerHover}
                  onMouseLeave={resetCursor}
                  disabled={submitting}
                  className="px-6 py-3 bg-neutral-900 text-white dark:bg-[#00FF00] dark:text-black font-sans text-xs font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white dark:text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    t('brief.submit')
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* SUCCESS STATE PANEL */
          <div className="text-center py-10 flex flex-col items-center">
            {/* Elegant SVG tick animation */}
            <div className="w-20 h-20 bg-emerald-500/10 dark:bg-[#00FF00]/10 rounded-full border border-emerald-500/20 dark:border-[#00FF00]/20 text-emerald-500 dark:text-[#00FF00] flex items-center justify-center mb-6 animate-[bounce_1s_1] shadow-[0_0_15px_#00FF0015]">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="font-display font-bold text-3xl text-neutral-900 dark:text-white mb-4 tracking-normal">
              {t('brief.success.title')}
            </h2>
            <p className="font-sans text-sm text-neutral-600 dark:text-white/50 max-w-sm leading-relaxed mb-8">
              {t('brief.success.desc')}
            </p>

            <button
              onClick={handleClose}
              onMouseEnter={triggerHover}
              onMouseLeave={resetCursor}
              className="px-8 py-3 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-sans text-xs font-bold uppercase tracking-wider rounded-full hover:scale-105 duration-200 transition-all cursor-pointer shadow-md"
            >
              {t('brief.success.close')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
