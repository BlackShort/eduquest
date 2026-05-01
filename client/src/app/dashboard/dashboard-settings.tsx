import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { MailCheck, Save, ShieldCheck, UserRound } from 'lucide-react';
import {
  changePassword,
  getCurrentUser,
  requestEmailVerification,
  updateUsername,
  verifyEmailCode,
} from '@/apis/auth-api';
import { useContextAPI } from '@/hooks/useContext';

export const DashboardSettings = () => {
  const { user, setUser } = useContextAPI();

  const [username, setUsername] = useState(user?.username ?? '');
  const [usernameLoading, setUsernameLoading] = useState(false);

  const [verificationCode, setVerificationCode] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const passwordError =
    securityData.newPassword.length > 0 && securityData.newPassword.length < 8
      ? 'New password must be at least 8 characters.'
      : '';

  const confirmPasswordError =
    securityData.confirmPassword.length > 0 && securityData.newPassword !== securityData.confirmPassword
      ? 'Passwords do not match.'
      : '';

  const usernameError = useMemo(() => {
    if (!username.trim()) return 'Username is required.';
    if (!/^[a-zA-Z0-9._]{3,30}$/.test(username.trim())) {
      return 'Username must be 3-30 chars and can contain letters, numbers, dot, underscore.';
    }
    return '';
  }, [username]);

  const handleUpdateUsername = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (usernameError) {
      toast.error(usernameError);
      return;
    }

    try {
      setUsernameLoading(true);
      const data = await updateUsername(username.trim());
      setUser(data.user);
      toast.success(data.message || 'Username updated');
    } catch (error: unknown) {
      const message = (error as { message?: string })?.message || 'Failed to update username';
      toast.error(message);
    } finally {
      setUsernameLoading(false);
    }
  };

  const handleSendVerificationCode = async () => {
    try {
      setVerificationLoading(true);
      const data = await requestEmailVerification();
      toast.success(data.message || 'Verification code generated');

      if (data.code) {
        toast.success(`Dev code: ${data.code}`);
      }
    } catch (error: unknown) {
      const message = (error as { message?: string })?.message || 'Failed to request verification code';
      toast.error(message);
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(verificationCode)) {
      toast.error('Enter a valid 6-digit verification code');
      return;
    }

    try {
      setVerificationLoading(true);
      const data = await verifyEmailCode(verificationCode);
      toast.success(data.message || 'Email verified');
      setVerificationCode('');

      const userData = await getCurrentUser();
      setUser(userData.user);
    } catch (error: unknown) {
      const message = (error as { message?: string })?.message || 'Failed to verify email';
      toast.error(message);
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (confirmPasswordError) {
      toast.error(confirmPasswordError);
      return;
    }

    try {
      setPasswordLoading(true);
      const data = await changePassword(
        securityData.currentPassword,
        securityData.newPassword,
        securityData.confirmPassword
      );
      toast.success(data.message || 'Password updated');
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: unknown) {
      const message = (error as { message?: string })?.message || 'Failed to update password';
      toast.error(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6 text-neutral-100">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-neutral-400 mt-1">Manage your account and security settings.</p>
      </div>

      <section className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <UserRound size={18} className="text-neutral-300" />
          <h2 className="text-lg font-semibold">Username</h2>
        </div>

        <form onSubmit={handleUpdateUsername} className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-sm text-neutral-300">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={usernameLoading}
              className="w-full h-11 px-3 rounded-lg bg-neutral-900 border border-neutral-700 text-sm outline-none focus:border-neutral-500 disabled:opacity-60"
              placeholder="Enter new username"
            />
            {usernameError ? <p className="text-xs text-red-400">{usernameError}</p> : null}
          </div>

          <button
            type="submit"
            disabled={usernameLoading}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-sm font-medium"
          >
            <Save size={16} />
            {usernameLoading ? 'Saving...' : 'Save Username'}
          </button>
        </form>
      </section>

      <section className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <MailCheck size={18} className="text-neutral-300" />
          <h2 className="text-lg font-semibold">Email Verification</h2>
        </div>

        <div className="rounded-lg bg-neutral-900 border border-neutral-700 p-3 text-sm">
          <p><span className="text-neutral-400">Email:</span> {user?.email || '-'}</p>
          <p className="mt-1">
            <span className="text-neutral-400">Status:</span>{' '}
            {user?.isVerified ? (
              <span className="text-emerald-400">Verified</span>
            ) : (
              <span className="text-amber-400">Not verified</span>
            )}
          </p>
        </div>

        {!user?.isVerified ? (
          <>
            <button
              type="button"
              onClick={handleSendVerificationCode}
              disabled={verificationLoading}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-neutral-700 hover:bg-neutral-600 disabled:opacity-60 text-sm font-medium"
            >
              {verificationLoading ? 'Sending...' : 'Send Verification Code'}
            </button>

            <form onSubmit={handleVerifyEmail} className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="verificationCode" className="text-sm text-neutral-300">6-digit verification code</label>
                <input
                  id="verificationCode"
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  disabled={verificationLoading}
                  className="w-full h-11 px-3 rounded-lg bg-neutral-900 border border-neutral-700 text-sm outline-none focus:border-neutral-500 disabled:opacity-60"
                  placeholder="Enter code"
                />
              </div>
              <button
                type="submit"
                disabled={verificationLoading}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-sm font-medium"
              >
                <ShieldCheck size={16} />
                {verificationLoading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>
          </>
        ) : null}
      </section>

      <section className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-neutral-300" />
          <h2 className="text-lg font-semibold">Change Password</h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="currentPassword" className="text-sm text-neutral-300">Current password</label>
            <input
              id="currentPassword"
              type="password"
              value={securityData.currentPassword}
              onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
              disabled={passwordLoading}
              className="w-full h-11 px-3 rounded-lg bg-neutral-900 border border-neutral-700 text-sm outline-none focus:border-neutral-500 disabled:opacity-60"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="newPassword" className="text-sm text-neutral-300">New password</label>
            <input
              id="newPassword"
              type="password"
              value={securityData.newPassword}
              onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
              disabled={passwordLoading}
              className="w-full h-11 px-3 rounded-lg bg-neutral-900 border border-neutral-700 text-sm outline-none focus:border-neutral-500 disabled:opacity-60"
              required
            />
            {passwordError ? <p className="text-xs text-red-400">{passwordError}</p> : null}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-sm text-neutral-300">Confirm new password</label>
            <input
              id="confirmPassword"
              type="password"
              value={securityData.confirmPassword}
              onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
              disabled={passwordLoading}
              className="w-full h-11 px-3 rounded-lg bg-neutral-900 border border-neutral-700 text-sm outline-none focus:border-neutral-500 disabled:opacity-60"
              required
            />
            {confirmPasswordError ? <p className="text-xs text-red-400">{confirmPasswordError}</p> : null}
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-sm font-medium"
          >
            <Save size={16} />
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </section>
    </div>
  );
};
