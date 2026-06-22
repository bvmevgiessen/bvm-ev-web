import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight, UserPlus } from 'lucide-react';
import { translations, LMSLanguage } from '../utils/lmsTranslations';

export default function LMSLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lang, setLang] = React.useState<LMSLanguage>(() => {
    return (localStorage.getItem('lms_lang') as LMSLanguage) || 'de';
  });

  const handleLanguageChange = (newLang: LMSLanguage) => {
    setLang(newLang);
    localStorage.setItem('lms_lang', newLang);
  };

  const t = translations[lang];

  React.useEffect(() => {
    if (user) {
      navigate('/lms/dashboard');
    }
  }, [user, navigate]);

  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/lms/dashboard');
    } catch (err: any) {
      setError(err.message || (lang === 'tr' ? 'Kimlik doğrulama sırasında bir hata oluştu.' : 'Ein Fehler ist bei der Authentifizierung aufgetreten.'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/lms/dashboard');
    } catch (err: any) {
      setError(err.message || (lang === 'tr' ? 'Kimlik doğrulama sırasında bir hata oluştu.' : 'Ein Fehler ist bei der Authentifizierung aufgetreten.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      
      {/* Floating Language Switcher */}
      <div className="mb-6 flex bg-slate-200/50 rounded-xl p-0.5 border border-slate-200">
        <button 
          onClick={() => handleLanguageChange('de')} 
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${lang === 'de' ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-600 hover:text-brand-navy'}`}
        >
          DE
        </button>
        <button 
          onClick={() => handleLanguageChange('tr')} 
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${lang === 'tr' ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-600 hover:text-brand-navy'}`}
        >
          TR
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="bg-brand-navy p-8 text-center relative">
          <h1 className="text-3xl font-bold text-white mb-2">
            {t.certProgram}
          </h1>
          <p className="text-slate-300 text-sm">
            {isLogin ? t.loginSub : t.registerSub}
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t.emailLabel}</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all outline-none text-slate-700"
                  placeholder={lang === 'tr' ? 'isminiz@ornek.com' : 'name@beispiel.de'}
                />
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t.passwordLabel}</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all outline-none text-slate-700"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-teal hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                t.pleaseWait
              ) : isLogin ? (
                <>{t.loginBtn} <ArrowRight size={20} /></>
              ) : (
                <>{t.registerBtn} <UserPlus size={20} /></>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center col-span-2">
            <div className="flex-1 border-t border-slate-200"></div>
            <div className="px-4 text-sm text-slate-400 font-bold">{t.or}</div>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border border-slate-200 hover:border-brand-teal text-slate-700 hover:text-brand-teal font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-3 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {t.googleBtn}
          </button>

          <div className="mt-8 text-center col-span-2">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-brand-teal hover:text-teal-700 font-bold text-sm transition-colors"
            >
              {isLogin ? t.noAccount : t.hasAccount}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
