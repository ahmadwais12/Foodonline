import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Mail, CreditCard, Bell, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { userService } from '@/services/user.service';
import { UserAddress } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/loading-spinner';
import AddressDialog from '@/components/user/AddressDialog';
import { toast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddressDialog, setShowAddressDialog] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadAddresses();
  }, [user]);

  const loadAddresses = async () => {
    if (!user) return;

    try {
      const data = await userService.getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error('Failed to load addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm(t('confirm_delete_address'))) return;

    try {
      await userService.deleteAddress(id);
      toast({ title: t('address_deleted') });
      loadAddresses();
    } catch (error: any) {
      console.error('Failed to delete address:', error);
      toast({
        title: t('error_deleting_address'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;

    try {
      await userService.setDefaultAddress(id);
      toast({ title: t('default_address_updated') });
      loadAddresses();
    } catch (error: any) {
      console.error('Failed to set default:', error);
      toast({
        title: t('error_updating_default_address'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">{t('my_profile')}</h1>

          {/* User Info */}
          <Card className="p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-16 h-16 rounded-full" />
                  ) : (
                    <User className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-1">{user.username}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                {t('logout')}
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card 
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate('/addresses')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{t('addresses')}</h3>
                  <p className="text-sm text-muted-foreground">{t('manage_delivery_locations')}</p>
                </div>
              </div>
            </Card>
            
            <Card 
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate('/payment-methods')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{t('payment_methods')}</h3>
                  <p className="text-sm text-muted-foreground">{t('manage_payment_options')}</p>
                </div>
              </div>
            </Card>
            
            <Card 
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate('/notifications')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{t('notifications')}</h3>
                  <p className="text-sm text-muted-foreground">{t('manage_alerts_updates')}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Saved Addresses */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">{t('saved_addresses')}</h3>
              </div>
              <Button onClick={() => setShowAddressDialog(true)}>
                {t('add_address')}
              </Button>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">{t('no_saved_addresses')}</p>
                <Button onClick={() => setShowAddressDialog(true)}>
                  {t('add_first_address')}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{address.label}</h4>
                        {address.is_default && (
                          <Badge variant="secondary" className="text-xs">
                            {t('default')}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                          disabled={address.is_default}
                        >
                          {t('set_default')}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          {t('delete')}
                        </Button>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{`${address.address_line1}${address.address_line2 ? `, ${address.address_line2}` : ''}, ${address.city}`}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
      
      <AddressDialog 
        open={showAddressDialog}
        onOpenChange={setShowAddressDialog}
        onSuccess={loadAddresses}
      />
    </div>
  );
}