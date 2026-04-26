import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, KeyRound, Copy, Check } from 'lucide-react';
import { cn } from '../utils/cn';
import { LiquidButton } from '../components/LiquidButton';
import { useStore, ALL_SECTIONS } from '../store/useStore';

export function Profile() {
  const navigate = useNavigate();
  const {
    registerAdmin, loginAdmin, users, adminSession, setAdminSession,
  } = useStore();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [nameField, setNameField] = useState('');
  const [passwordField, setPasswordField] = useState('');
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);
  const [copied, setCopied] = useState(false);

  // Navigate to admin AFTER adminSession is set in context
  useEffect(() => {
    if (adminSession) {
      navigate('/admin', { replace: true });
    }
  }, [adminSession, navigate]);

  // Already logged in — show nothing while redirecting
  if (adminSession) {
    return null;
  }

  const handleRegister = () => {
    if (!nameField.trim() || !passwordField.trim()) { setError('Заполните все поля'); return; }
    if (passwordField.length < 4) { setError('Пароль должен быть не менее 4 символов'); return; }
    registerAdmin(nameField.trim(), passwordField.trim());
    setRegistered(true);
    setError('');
  };

  const handleLogin = () => {
    if (!nameField.trim() || !passwordField.trim()) { setError('Заполните все поля'); return; }
    if (loginAdmin(nameField.trim(), passwordField.trim())) {
      const userRole = users.find(u => u.name === nameField.trim() && u.password === passwordField.trim());
      if (userRole) {
        setAdminSession({ name: userRole.name, role: userRole.role, sections: userRole.sections });
      } else {
        setAdminSession({ name: nameField.trim(), role: 'admin', sections: [...ALL_SECTIONS] });
      }
      setError('');
      // Navigation happens via useEffect when adminSession updates
    } else {
      setError('Неверное имя или пароль');
    }
  };

  const handleCopyCredentials = () => {
    const text = `ROOOMEBEL Админ\nИмя: ${nameField.trim()}\nПароль: ${passwordField.trim()}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleEnterPanel = () => {
    setAdminSession({ name: nameField.trim(), role: 'admin', sections: [...ALL_SECTIONS] });
    setRegistered(false);
    // Navigation happens via useEffect when adminSession updates
  };

  const handleSubmit = () => {
    authMode === 'login' ? handleLogin() : handleRegister();
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex bg-primary/5 rounded-full p-4 mb-4">
          <KeyRound size={32} className="opacity-60" />
        </div>
        <h2 className="text-3xl font-bold">
          <span className="text-red-500">Л</span>
          <span
            className="animate-title-gradient"
            style={{
              background: 'linear-gradient(315deg, rgba(180,220,255,1) 0%, rgba(255,255,255,1) 25%, rgba(200,230,255,1) 50%, rgba(180,200,255,1) 75%, rgba(255,240,245,1) 100%)',
              backgroundSize: '400% 400%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >ичный кабинет</span>
        </h2>
        <p className="text-sm opacity-40 mt-2">ROOOMEBEL</p>
      </div>

      {/* Registration success */}
      {registered && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface rounded-3xl shadow-sm p-6 mb-6 text-center">
          <div className="inline-flex bg-green-50 rounded-full p-3 mb-4">
            <Check size={24} className="text-green-600" />
          </div>
          <h3 className="text-lg font-bold mb-2">Регистрация успешна!</h3>
          <p className="text-sm opacity-50 mb-5 leading-relaxed">
            Сохраните ваши учётные данные, чтобы вы могли зайти и пользоваться прекрасным веб-сервисом интернет-магазина ROOOMEBEL
          </p>
          <div className="bg-background rounded-2xl p-4 mb-4 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs opacity-40 uppercase tracking-wider">Ваши данные</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-50 w-16">Имя:</span>
                <span className="text-sm font-bold">{nameField}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-50 w-16">Пароль:</span>
                <span className="text-sm font-bold">{passwordField}</span>
              </div>
            </div>
          </div>
          <button onClick={handleCopyCredentials} className={cn(
            "w-full rounded-full py-3.5 font-bold flex items-center justify-center gap-2 transition-all mb-3",
            copied ? "bg-green-600 text-white" : "bg-surface border border-primary/15 hover:bg-primary/5"
          )}>
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Скопировано!' : 'Скопировать имя и пароль'}
          </button>
          <button onClick={handleEnterPanel} className="w-full bg-primary text-primary-inv rounded-full py-3.5 font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform">
            Войти в панель
          </button>
        </motion.div>
      )}

      {/* Login / Register form */}
      {!registered && (
        <div className="space-y-4">
          <div className="bg-surface rounded-3xl shadow-sm p-6 space-y-4">
            {/* Tab switcher */}
            <div className="flex gap-3 justify-center mb-2">
              {[
                { label: 'Вход', mode: 'login' as const, icon: LogIn },
                { label: 'Регистрация', mode: 'register' as const, icon: UserPlus },
              ].map((tab) => (
                <button
                  key={tab.mode}
                  onClick={() => { setAuthMode(tab.mode); setError(''); }}
                  className={cn(
                    "relative px-6 py-2.5 pill font-bold text-sm transition-all overflow-hidden flex items-center gap-1.5",
                    authMode === tab.mode ? "text-white shadow-lg scale-105" : "opacity-50 hover:opacity-80"
                  )}
                  style={authMode === tab.mode ? {
                    background: 'linear-gradient(315deg, rgba(101,0,94,1) 3%, rgba(60,132,206,1) 38%, rgba(48,238,226,1) 68%, rgba(255,25,25,1) 98%)',
                    backgroundSize: '400% 400%',
                    animation: 'gradient 6s ease infinite',
                  } : {}}
                >
                  <tab.icon size={15} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold opacity-50 px-1 block">Имя</label>
              <input
                type="text"
                value={nameField}
                onChange={(e) => { setNameField(e.target.value); setError(''); }}
                placeholder="Введите ваше имя"
                className="w-full bg-background rounded-2xl px-5 py-4 border border-primary/5 focus:ring-2 focus:ring-primary outline-none text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold opacity-50 px-1 block">Пароль</label>
              <input
                type="password"
                value={passwordField}
                onChange={(e) => { setPasswordField(e.target.value); setError(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                placeholder={authMode === 'register' ? 'Придумайте пароль' : 'Введите пароль'}
                className="w-full bg-background rounded-2xl px-5 py-4 border border-primary/5 focus:ring-2 focus:ring-primary outline-none text-sm"
              />
            </div>
            {error && <p className="text-sm text-terracotta text-center">{error}</p>}
          </div>
          <div className="flex justify-center">
            <LiquidButton width={320} height={56} onClick={handleSubmit}>
              {authMode === 'login' ? <><LogIn size={18} /> Войти</> : <><UserPlus size={18} /> Зарегистрироваться</>}
            </LiquidButton>
          </div>
        </div>
      )}
    </div>
  );
}
