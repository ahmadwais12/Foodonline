import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Save,
  CreditCard,
  Store,
  DollarSign,
  MapPin,
  Clock,
  Bell,
  Shield,
  Key,
  Globe,
  Mail,
  Phone,
  Layout,
  Smartphone,
  Server,
  AlertCircle,
  Activity,
  ChevronRight,
  User as UserIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { adminService } from '@/services/admin.service';
import { Skeleton } from '@/components/ui/skeleton';

interface SystemSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  currency: string;
  timezone: string;
  default_delivery_fee: number;
  min_order_amount: number;
  enable_guest_checkout: boolean;
  enable_sms_notifications: boolean;
  enable_email_notifications: boolean;
  maintenance_mode: boolean;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    site_name: 'FoodDash',
    site_description: 'Order delicious food online',
    contact_email: 'admin@fooddash.com',
    contact_phone: '+1 (555) 123-4567',
    currency: 'USD',
    timezone: 'America/New_York',
    default_delivery_fee: 2.99,
    min_order_amount: 10.00,
    enable_guest_checkout: true,
    enable_sms_notifications: false,
    enable_email_notifications: true,
    maintenance_mode: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    setSettings(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const handleSwitchChange = (name: keyof SystemSettings) => {
    setSettings(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // In a real implementation, we'd call adminService.updateSettings()
      // For now, let's at least simulate success
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Saving settings:', settings);
      // alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 min-h-[80vh]">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto pb-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <Settings className="h-10 w-10 text-primary" />
            Control Center
          </h1>
          <p className="text-muted-foreground text-lg mt-1">
            Global configuration and platform orchestration for FoodDash.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full px-6 h-11 border-none bg-muted/50 font-bold">System Status</Button>
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="gradient-primary rounded-full px-8 shadow-lg shadow-primary/20 h-11 font-bold min-w-[160px]"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Synchronizing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-5 w-5" />
                Apply Changes
              </div>
            )}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Branding & General */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="glass-effect border-none shadow-xl rounded-[2rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">Branding & Core</CardTitle>
                  <CardDescription>Identity and regional settings.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="site_name" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Platform Name</Label>
                  <Input
                    id="site_name"
                    name="site_name"
                    value={settings.site_name}
                    onChange={handleInputChange}
                    className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Active Currency</Label>
                  <Input
                    id="currency"
                    name="currency"
                    value={settings.currency}
                    onChange={handleInputChange}
                    className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_description" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Meta Description</Label>
                <Input
                  id="site_description"
                  name="site_description"
                  value={settings.site_description}
                  onChange={handleInputChange}
                  className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">System Timezone</Label>
                <Input
                  id="timezone"
                  name="timezone"
                  value={settings.timezone}
                  onChange={handleInputChange}
                  className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Financial & Logistics */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="glass-effect border-none shadow-xl rounded-[2rem] overflow-hidden h-full">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-emerald-500/10 rounded-2xl">
                  <DollarSign className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">Economics</CardTitle>
                  <CardDescription>Fee structures and order constraints.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Standard Delivery</Label>
                    <span className="text-xs font-bold text-primary">${settings.default_delivery_fee}</span>
                  </div>
                  <Input
                    name="default_delivery_fee"
                    type="number"
                    step="0.01"
                    value={settings.default_delivery_fee}
                    onChange={handleInputChange}
                    className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-black text-xl"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Minimum Basket</Label>
                    <span className="text-xs font-bold text-primary">${settings.min_order_amount}</span>
                  </div>
                  <Input
                    name="min_order_amount"
                    type="number"
                    step="0.01"
                    value={settings.min_order_amount}
                    onChange={handleInputChange}
                    className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-black text-xl"
                  />
                </div>
              </div>

              <div className="p-6 bg-primary/5 rounded-[1.5rem] border border-primary/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-primary" />
                      Guest Checkout
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">Allow orders without account registration.</p>
                  </div>
                  <Switch
                    checked={settings.enable_guest_checkout}
                    onCheckedChange={() => handleSwitchChange('enable_guest_checkout')}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications & Communications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-effect border-none shadow-xl rounded-[2rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-purple-500/10 rounded-2xl">
                  <Bell className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">Alert Engine</CardTitle>
                  <CardDescription>Automated communication channels.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-xl">
                      <Mail className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Email Orchestration</p>
                      <p className="text-xs text-muted-foreground">Transactional and marketing emails.</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.enable_email_notifications}
                    onCheckedChange={() => handleSwitchChange('enable_email_notifications')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-xl">
                      <Smartphone className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">SMS Gateway</p>
                      <p className="text-xs text-muted-foreground">Direct carrier messaging for orders.</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.enable_sms_notifications}
                    onCheckedChange={() => handleSwitchChange('enable_sms_notifications')}
                  />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Noreply Email</Label>
                  <Input
                    name="contact_email"
                    type="email"
                    value={settings.contact_email}
                    onChange={handleInputChange}
                    className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Support Phone</Label>
                  <Input
                    name="contact_phone"
                    value={settings.contact_phone}
                    onChange={handleInputChange}
                    className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-bold"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security & System */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-effect border-none shadow-xl rounded-[2rem] overflow-hidden h-full">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-red-500/10 rounded-2xl">
                  <Shield className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">Security Shield</CardTitle>
                  <CardDescription>Platform integrity and state management.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="p-6 bg-red-500/5 rounded-[1.5rem] border border-red-500/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-red-500">
                      <Server className="h-4 w-4" />
                      Maintenance Mode
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">Instantly take the platform offline for updates.</p>
                  </div>
                  <Switch
                    checked={settings.maintenance_mode}
                    onCheckedChange={() => handleSwitchChange('maintenance_mode')}
                    className="data-[state=checked]:bg-red-500"
                  />
                </div>
                {settings.maintenance_mode && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 rounded-xl text-red-500 text-xs font-bold animate-pulse">
                    <AlertCircle className="h-4 w-4" />
                    Platform is currently hidden from public.
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Button variant="outline" className="w-full h-12 rounded-2xl border-none bg-muted/30 font-bold flex justify-between px-6 hover:bg-muted/50 transition-all">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    Rotate API Keys
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full h-12 rounded-2xl border-none bg-muted/30 font-bold flex justify-between px-6 hover:bg-muted/50 transition-all">
                  <div className="flex items-center gap-3">
                    <Layout className="h-5 w-5 text-muted-foreground" />
                    Flush System Cache
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}