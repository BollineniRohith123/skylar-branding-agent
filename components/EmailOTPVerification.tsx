import React, { useState } from 'react';
import { XIcon, MailIcon, ShieldIcon } from './icons';

interface EmailOTPVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  onSessionStored?: (sessionId: string, email: string, verifiedAt: string) => void;
}

const EmailOTPVerification: React.FC<EmailOTPVerificationProps> = ({
  isOpen,
  onClose,
  onVerified,
  userEmail,
  setUserEmail,
  onSessionStored,
}) => {
  const [currentStep, setCurrentStep] = useState<'email' | 'otp'>('email');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateOTP = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    return newOtp;
  };

  const handleSendOTP = async () => {
    if (!userEmail || !userEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call backend to send OTP
      const resp = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        // Check if it's an "already used" error
        if (data.alreadyUsed) {
          throw new Error('⚠️ This email has already been used and verified. Please use a different email address.');
        }
        throw new Error(data.error || 'Failed to send OTP');
      }
      // Switch to OTP entry step
      setCurrentStep('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }
    setIsLoading(true);
    setError('');
    (async () => {
      try {
        const resp = await fetch('/api/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail, otp }),
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error || 'Verification failed');
        
        // Store session if session data is returned
        if (data.sessionId && data.email && data.verifiedAt && onSessionStored) {
          onSessionStored(data.sessionId, data.email, data.verifiedAt);
        }
        
        onVerified();
        handleClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid OTP. Please try again.');
      } finally {
        setIsLoading(false);
      }
    })();
  };

  const handleClose = () => {
    setCurrentStep('email');
    setOtp('');
    setGeneratedOtp('');
    setError('');
    onClose();
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError('');
    try {
      const resp = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Failed to resend OTP');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md mx-4">
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
          aria-label="Close verification"
        >
          <XIcon className="h-5 w-5" />
        </button>

        <div className="glass-card p-8 rounded-2xl shadow-2xl border border-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              {currentStep === 'email' ? (
                <MailIcon className="h-8 w-8 text-white" />
              ) : (
                <ShieldIcon className="h-8 w-8 text-white" />
              )}
            </div>
            <h3 className="text-2xl font-bold gradient-text mb-2">
              {currentStep === 'email' ? 'Enter Your Email' : 'Verify OTP'}
            </h3>
            <p className="text-gray-400 text-sm">
              {currentStep === 'email' 
                ? 'Please enter your email address to receive a verification code'
                : `Enter the 6-digit code sent to ${userEmail}`
              }
            </p>
          </div>

          {/* Email Step */}
          {currentStep === 'email' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleSendOTP}
                disabled={isLoading || !userEmail}
                className="w-full btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-solid border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <MailIcon className="h-4 w-4" />
                    Send OTP
                  </>
                )}
              </button>
            </div>
          )}

          {/* OTP Step */}
          {currentStep === 'otp' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2">
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-center text-2xl tracking-widest placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  onKeyPress={(e) => e.key === 'Enter' && handleVerifyOTP()}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={() => setCurrentStep('email')}
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Change Email
                </button>
                <button
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors duration-300 disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
                className="w-full btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-solid border-white/30 border-t-white rounded-full animate-spin"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldIcon className="h-4 w-4" />
                    Verify & Continue
                  </>
                )}
              </button>

              {/* Demo Note */}
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                <p className="text-indigo-400 text-xs text-center">
                  Demo: Check console for OTP (or use 123456)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailOTPVerification;
