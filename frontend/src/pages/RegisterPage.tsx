import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, User, Lock, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import logo from '@/assets/logo.jpg';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, you would send the OTP to the user's email
      // For demo purposes, we'll just simulate this
      setTimeout(() => {
        toast({
          title: t('verification_code_sent'),
          description: t('check_email_for_code'),
        });
        setStep('verify');
        setLoading(false);
      }, 1000);
    } catch (error: any) {
      console.error('Failed to send OTP:', error);
      toast({
        title: t('error'),
        description: error.message || t('failed_to_send_verification_code'),
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: t('passwords_do_not_match'),
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: t('password_too_short'),
        description: t('password_min_length'),
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate OTP verification
      if (otp !== '1234') {
        throw new Error(t('invalid_verification_code'));
      }
      
      const user = await authService.register({ email, password, username });
      login(user);
      
      toast({
        title: t('account_created'),
        description: t('welcome_to_fooddash'),
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast({
        title: t('registration_failed'),
        description: error.message || t('invalid_verification_code'),
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="overflow-hidden border-0 shadow-2xl bg-background/90 backdrop-blur-xl rounded-3xl">
          {/* Header with decorative elements */}
          <div className="relative bg-gradient-to-r from-primary to-primary-700 p-8 text-center">
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-white/10 animate-pulse"></div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.2
              }}
              className="relative z-10"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-lg">
                <img src={logo} alt="FoodDash Logo" className="w-12 h-12 rounded-lg" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{t('sign_up')}</h1>
              <p className="text-primary-foreground/80">{t('join_fooddash_today')}</p>
            </motion.div>
          </div>

          <div className="p-8">
            {step === 'email' ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Label htmlFor="email">{t('email')}</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('email_placeholder')}
                      className="pl-10 py-6 rounded-xl border-2 focus:border-primary transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Label htmlFor="username">{t('username')}</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder={t('username_placeholder')}
                      className="pl-10 py-6 rounded-xl border-2 focus:border-primary transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full py-6 rounded-xl gradient-primary hover:opacity-90 transition-all duration-300 text-base font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    size="lg" 
                    disabled={loading}
                  >
                    {loading ? t('sending') : t('send_verification_code')}
                  </Button>
                </motion.div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Label htmlFor="otp">{t('verification_code')}</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder={t('enter_verification_code')}
                    className="py-6 rounded-xl border-2 focus:border-primary transition-all duration-300 focus:ring-2 focus:ring-primary/20 text-center text-2xl tracking-widest"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={4}
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-2">{t('enter_4_digit_code')}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Label htmlFor="password">{t('password')}</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t('password_placeholder')}
                      className="pl-10 pr-12 py-6 rounded-xl border-2 focus:border-primary transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Label htmlFor="confirmPassword">{t('confirm_password')}</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t('confirm_password_placeholder')}
                      className="pl-10 pr-12 py-6 rounded-xl border-2 focus:border-primary transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full py-6 rounded-xl gradient-primary hover:opacity-90 transition-all duration-300 text-base font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    size="lg" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {t('creating_account')}
                      </div>
                    ) : (
                      t('create_account')
                    )}
                  </Button>
                </motion.div>
              </form>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.7 }}
              className="mt-8 text-center text-sm text-muted-foreground"
            >
              {t('already_have_account')}{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-medium text-primary hover:text-primary-600 transition-colors"
              >
                {t('sign_in')}
              </button>
            </motion.p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}