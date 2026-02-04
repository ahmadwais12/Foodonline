import { useState, useEffect } from 'react';
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
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { adminService } from '@/services/admin.service';
import LoadingSpinner from '@/components/ui/loading-spinner';

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
      // For now, we'll use default settings
      // In a real implementation, we'd call adminService.getSettings()
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
      // For now, we'll simulate saving settings
      // In a real implementation, we'd call adminService.updateSettings()
      console.log('Saving settings:', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            System Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure your platform settings and preferences
          </p>
        </div>
        
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="site_name">Site Name</Label>
              <Input
                id="site_name"
                name="site_name"
                value={settings.site_name}
                onChange={handleInputChange}
                placeholder="Enter site name"
              />
            </div>
            
            <div>
              <Label htmlFor="site_description">Site Description</Label>
              <Input
                id="site_description"
                name="site_description"
                value={settings.site_description}
                onChange={handleInputChange}
                placeholder="Enter site description"
              />
            </div>
            
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                name="currency"
                value={settings.currency}
                onChange={handleInputChange}
                placeholder="Currency code (e.g., USD)"
              />
            </div>
            
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                name="timezone"
                value={settings.timezone}
                onChange={handleInputChange}
                placeholder="Timezone (e.g., America/New_York)"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                value={settings.contact_email}
                onChange={handleInputChange}
                placeholder="admin@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                value={settings.contact_phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Business Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="default_delivery_fee">Default Delivery Fee ($)</Label>
              <Input
                id="default_delivery_fee"
                name="default_delivery_fee"
                type="number"
                step="0.01"
                value={settings.default_delivery_fee}
                onChange={handleInputChange}
                placeholder="2.99"
              />
            </div>
            
            <div>
              <Label htmlFor="min_order_amount">Minimum Order Amount ($)</Label>
              <Input
                id="min_order_amount"
                name="min_order_amount"
                type="number"
                step="0.01"
                value={settings.min_order_amount}
                onChange={handleInputChange}
                placeholder="10.00"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enable_email_notifications" className="text-base">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enable email notifications for customers and admins
                </p>
              </div>
              <Switch
                id="enable_email_notifications"
                checked={settings.enable_email_notifications}
                onCheckedChange={() => handleSwitchChange('enable_email_notifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enable_sms_notifications" className="text-base">
                  SMS Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enable SMS notifications for order updates
                </p>
              </div>
              <Switch
                id="enable_sms_notifications"
                checked={settings.enable_sms_notifications}
                onCheckedChange={() => handleSwitchChange('enable_sms_notifications')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Checkout Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Checkout Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enable_guest_checkout" className="text-base">
                  Guest Checkout
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow customers to checkout without an account
                </p>
              </div>
              <Switch
                id="enable_guest_checkout"
                checked={settings.enable_guest_checkout}
                onCheckedChange={() => handleSwitchChange('enable_guest_checkout')}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenance_mode" className="text-base">
                  Maintenance Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable the site for maintenance
                </p>
              </div>
              <Switch
                id="maintenance_mode"
                checked={settings.maintenance_mode}
                onCheckedChange={() => handleSwitchChange('maintenance_mode')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}