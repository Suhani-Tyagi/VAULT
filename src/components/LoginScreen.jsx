import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import PropTypes from 'prop-types';

export const LoginScreen = ({ onLogin, user }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const success = await onLogin(password);
    setIsSubmitting(false);

    if (!success) {
      setErrorMsg('Incorrect password. Default master password is "vault2026".');
    }
  };

  return (
    <div className="min-h-screen bg-vault-paper dark:bg-[#141210] text-vault-ink dark:text-vault-text flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-sm bg-vault-surface border border-vault-rule rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-vault-reserveBlue text-white flex items-center justify-center font-bold text-base font-serif mx-auto shadow-sm">
            V
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-vault-ink dark:text-vault-text font-sans">
              VAULT
            </h1>
            <p className="text-xs text-vault-muted dark:text-vault-mutedDark font-mono mt-0.5 uppercase tracking-wider">
              Personal Banking
            </p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-lg font-bold text-vault-ink dark:text-vault-text font-sans">Welcome back</h2>
          <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5 font-mono">
            Authenticate to access your banking dashboard
          </p>
        </div>

        {/* User Card */}
        <div className="p-3 bg-vault-paper border border-vault-rule rounded-xl flex items-center gap-3 font-mono text-xs">
          <img 
            src={user.profilePic} 
            alt={user.name} 
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover border border-vault-rule shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="font-bold text-vault-ink dark:text-vault-text font-sans truncate">{user.name}</p>
            <p className="text-[11px] text-vault-muted dark:text-vault-mutedDark truncate">{user.email}</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 font-mono text-xs">
            <label htmlFor="login-password-input" className="font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider block">
              Password
            </label>

            <div className="relative flex items-center bg-vault-paper border border-vault-rule rounded-lg px-3 py-2.5 focus-within:border-vault-reserveBlue transition-colors">
              <Lock className="w-4 h-4 text-vault-muted mr-2.5 shrink-0" />
              <input 
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                placeholder="Enter password..."
                className="w-full bg-transparent text-xs text-vault-ink dark:text-vault-text placeholder-vault-muted focus:outline-none font-mono"
              />
              <button 
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
                className="text-vault-muted hover:text-vault-ink p-1 rounded transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          <div aria-live="polite">
            {errorMsg && (
              <div className="p-3 bg-vault-roseLight border border-vault-rose/30 rounded-lg flex items-start gap-2 text-xs text-vault-rose font-mono">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-vault-rose" />
                <p>{errorMsg}</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !password}
            className="w-full py-3 bg-vault-reserveBlue hover:bg-vault-reserveBlueHover disabled:opacity-50 text-white font-mono font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security Footer Note */}
        <p className="text-[11px] font-mono text-vault-muted dark:text-vault-mutedDark text-center flex items-center justify-center gap-1.5 pt-2 border-t border-vault-rule">
          <ShieldCheck className="w-3.5 h-3.5 text-vault-emerald shrink-0" />
          <span>Encrypted Session • Default password is vault2026</span>
        </p>
      </div>
    </div>
  );
};

LoginScreen.propTypes = {
  onLogin: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};
