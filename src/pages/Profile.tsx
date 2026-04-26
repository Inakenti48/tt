import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, KeyRound, Copy, Check, LogOut, User } from 'lucide-react';
import { cn } from '../utils/cn';
import { LiquidButton } from '../components/LiquidButton';
import { useStore, ALL_SECTIONS } from '../store/useStore';
import { useTheme } from '../context/ThemeContext';

export function Profile() {
  const navigate = useNavigate();
  const {
    loginAdmin, users, adminSession, setAdminSession,
    userSession, setUserSession, logoutUser, registerUser, loginUser,
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

  // Already logged in as admin — show nothing while redirecting
  if (adminSession) {
    return null;
  }

  const handleRegister = () => {
    if (!nameField.trim() || !passwordField.trim()) { setError('Заполните все поля'); return; }
    if (passwordField.length < 4) { setError('Пароль должен быть не менее 4 символов'); return; }
    const ok = registerUser(nameField.trim(), passwordField.trim());
    if (!ok) { setError('Имя уже занято'); return; }
    setRegistered(true);
    setError('');
  };

  const handleLogin = () => {
    if (!nameField.trim() || !passwordField.trim()) { setError('Заполните все поля'); return; }
    const name = nameField.trim();
    const pass = passwordField.trim();

    // Check admin first (admin/admin or sub-users created by admin)
    if (loginAdmin(name, pass)) {
      const userRole = users.find(u => u.name === name && u.password === pass);
      if (userRole) {
        setAdminSession({ name: userRole.name, role: userRole.role, sections: userRole.sections });
      } else {
        setAdminSession({ name, role: 'admin', sections: [...ALL_SECTIONS] });
      }
      setError('');
      return;
    }

    // Check regular user
    if (loginUser(name, pass)) {
      setUserSession({ name });
      setError('');
      navigate('/', { replace: true });
      return;
    }

    setError('Неверное имя или пароль');
  };

  const handleCopyCredentials = () => {
    const text = `ROOOMEBEL\nИмя: ${nameField.trim()}\nПароль: ${passwordField.trim()}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleEnterShop = () => {
    setUserSession({ name: nameField.trim() });
    setRegistered(false);
    navigate('/', { replace: true });
  };

  const handleSubmit = () => {
    authMode === 'login' ? handleLogin() : handleRegister();
  };

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const neuBg = isDark ? '#2a2a2e' : '#e0e5ec';
  const neuShadow = isDark
    ? '8px 8px 16px #1a1a1d'
    : '8px 8px 16px rgba(0,0,0,0.12)';
  const neuShadowSm = isDark
    ? '3px 3px 6px #1a1a1d'
    : '3px 3px 6px rgba(0,0,0,0.1)';
  const neuShadowMd = isDark
    ? '4px 4px 8px #1a1a1d'
    : '4px 4px 10px rgba(0,0,0,0.1)';
  const neuInsetShadow = isDark
    ? 'inset 4px 4px 8px #1a1a1d, inset -4px -4px 8px #3a3a3f'
    : 'inset 4px 4px 8px #c8cdd4, inset -4px -4px 8px #f0f2f5';
  const neuInsetShadowSm = isDark
    ? 'inset 3px 3px 6px #1a1a1d, inset -3px -3px 6px #3a3a3f'
    : 'inset 3px 3px 6px #c8cdd4, inset -3px -3px 6px #f0f2f5';
  const neuTextColor = isDark ? '#e0e0e0' : '#333';
  const neuLabelColor = isDark ? '#ccc' : '#000';

  const neuCard: React.CSSProperties = {
    background: neuBg,
    borderRadius: '24px',
    boxShadow: neuShadow,
    border: 'none',
    padding: '32px',
    color: neuTextColor,
  };
  const neuInset: React.CSSProperties = {
    background: neuBg,
    borderRadius: '50px',
    boxShadow: neuInsetShadow,
    border: 'none',
    color: neuTextColor,
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex rounded-full p-4 mb-4" style={{ background: neuBg, boxShadow: neuShadowMd }}>
          <KeyRound size={32} style={{ opacity: 0.6, color: neuTextColor }} />
        </div>
        <p className="text-sm opacity-40 mt-2">ROOOMEBEL</p>
      </div>

      {/* Logged in as regular user — profile card */}
      {userSession && !registered && (
        <div className="space-y-5" style={neuCard}>
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full p-4" style={{ background: neuBg, boxShadow: neuShadowSm }}>
              <User size={28} style={{ color: neuTextColor }} />
            </div>
            <h3 className="text-lg font-bold">{userSession.name}</h3>
            <p className="text-xs opacity-50">Покупатель</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/catalog')} className="flex-1 bg-primary text-primary-inv rounded-full py-3 font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform">
              В каталог
            </button>
            <button onClick={() => { logoutUser(); }} className="flex-1 rounded-full py-3 font-bold text-sm flex items-center justify-center gap-1.5" style={{ background: neuBg, boxShadow: neuShadowSm, color: neuTextColor }}>
              <LogOut size={15} /> Выйти
            </button>
          </div>
        </div>
      )}

      {/* Registration success */}
      {registered && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center" style={neuCard}>
          <div className="inline-flex rounded-full p-3 mb-4" style={{ background: neuBg, boxShadow: neuShadowSm }}>
            <Check size={24} className="text-green-600" />
          </div>
          <h3 className="text-lg font-bold mb-2">Регистрация успешна!</h3>
          <p className="text-sm opacity-50 mb-5 leading-relaxed">
            Сохраните ваши учётные данные, чтобы вы могли зайти и пользоваться прекрасным веб-сервисом интернет-магазина ROOOMEBEL
          </p>
          <div className="rounded-2xl p-4 mb-4 text-left" style={{ background: neuBg, boxShadow: neuInsetShadowSm, borderRadius: '16px' }}>
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
            copied ? "bg-green-600 text-white" : ""
          )} style={copied ? {} : { background: neuBg, boxShadow: neuShadowMd }}>
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Скопировано!' : 'Скопировать имя и пароль'}
          </button>
          <button onClick={handleEnterShop} className="w-full bg-primary text-primary-inv rounded-full py-3.5 font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform">
            Перейти в магазин
          </button>
        </motion.div>
      )}

      {/* Login / Register form */}
      {!registered && !userSession && (
        <div className="space-y-6">
          <div className="space-y-5" style={neuCard}>
            {/* Tab switcher — kept as-is with gradient */}
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
                    authMode === tab.mode ? "text-white scale-105" : "opacity-50 hover:opacity-80"
                  )}
                  style={authMode === tab.mode ? {
                    background: 'linear-gradient(315deg, rgba(101,0,94,1) 3%, rgba(60,132,206,1) 38%, rgba(48,238,226,1) 68%, rgba(255,25,25,1) 98%)',
                    backgroundSize: '400% 400%',
                    animation: 'gradient 6s ease infinite',
                    boxShadow: neuShadowMd,
                  } : { background: neuBg, boxShadow: neuShadowSm, color: neuTextColor }}
                >
                  <tab.icon size={15} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold px-1 block" style={{ color: neuLabelColor }}>Имя</label>
              <input
                type="text"
                value={nameField}
                onChange={(e) => { setNameField(e.target.value); setError(''); }}
                placeholder="Введите ваше имя"
                className="w-full px-5 py-4 outline-none text-sm"
                style={neuInset}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold px-1 block" style={{ color: neuLabelColor }}>Пароль</label>
              <input
                type="password"
                value={passwordField}
                onChange={(e) => { setPasswordField(e.target.value); setError(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                placeholder={authMode === 'register' ? 'Придумайте пароль' : 'Введите пароль'}
                className="w-full px-5 py-4 outline-none text-sm"
                style={neuInset}
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
