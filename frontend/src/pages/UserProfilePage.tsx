import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, Mail, Phone, Calendar, CreditCard, Bell, 
  Settings, Edit2, Camera, Save, X, Loader2, Shield, Lock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { userService } from '@/services/user.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  username: string;
  phone?: string;
  avatar?: string;
  role: string;
  created_at: string;
  last_login?: string;
}

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const userProfile = await userService.getProfile();
      setProfile(userProfile);
      setFormData({
        username: userProfile.username || '',
        phone: userProfile.phone || '',
        email: userProfile.email || ''
      });
    } catch (err: any) {
      console.error('Failed to load profile:', err);
      toast({
        title: 'Error loading profile',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await userService.updateProfile({
        username: formData.username,
        phone: formData.phone
      });
      
      toast({ title: 'Profile updated successfully' });
      setEditing(false);
      loadProfile();
    } catch (err: any) {
      toast({
        title: 'Failed to update profile',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleAvatarChange = () => {
    toast({
      title: 'Avatar upload',
      description: 'Avatar upload feature coming soon!',
    });
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-10 w-48 mb-8" />
            
            <Card className="p-6">
              <div className="flex items-center gap-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <Button variant="outline" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>

          {/* Profile Header Card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {profile?.avatar ? (
                      <img 
                        src={profile.avatar} 
                        alt={profile.username} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <User className="h-12 w-12 text-primary" />
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                    onClick={handleAvatarChange}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-semibold">{profile?.username}</h2>
                    <Badge variant="secondary" className="capitalize">
                      {profile?.role}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {profile?.email}
                  </p>
                  {profile?.phone && (
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4" />
                      {profile.phone}
                    </p>
                  )}
                </div>

                {/* Edit Button */}
                <Button 
                  variant={editing ? "default" : "outline"}
                  onClick={() => editing ? handleSaveProfile() : setEditing(true)}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : editing ? (
                    <Save className="h-4 w-4 mr-2" />
                  ) : (
                    <Edit2 className="h-4 w-4 mr-2" />
                  )}
                  {editing ? 'Save Changes' : 'Edit Profile'}
                </Button>
                {editing && (
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        username: profile?.username || '',
                        phone: profile?.phone || '',
                        email: profile?.email || ''
                      });
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabs Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Account Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member Since</span>
                      <span className="font-medium">
                        {profile?.created_at 
                          ? new Date(profile.created_at).toLocaleDateString() 
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Type</span>
                      <span className="font-medium capitalize">{profile?.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User ID</span>
                      <span className="font-medium text-sm">{profile?.id}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Account Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Email Verification</span>
                      <Badge variant="default">Verified</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Account Status</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Two-Factor Auth</span>
                      <Badge variant="secondary">Not Enabled</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => navigate('/user/addresses')}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Manage Addresses
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => navigate('/user/payment-methods')}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Methods
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => navigate('/user/orders')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Order History
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => navigate('/user/notifications')}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Personal Info Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        disabled={!editing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={true}
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        disabled={!editing}
                        placeholder="Add your phone number"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Change Password</p>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                    </div>
                    <Button variant="outline" disabled>Enable 2FA</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Login Sessions</p>
                      <p className="text-sm text-muted-foreground">Manage your active sessions</p>
                    </div>
                    <Button variant="outline">View Sessions</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Account Preferences
                  </CardTitle>
                  <CardDescription>Customize your account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive order updates and promotions</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/user/notifications')}
                    >
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Language & Region</p>
                      <p className="text-sm text-muted-foreground">Set your preferred language</p>
                    </div>
                    <Button variant="outline" disabled>English (US)</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Privacy Settings</p>
                      <p className="text-sm text-muted-foreground">Manage your data and privacy</p>
                    </div>
                    <Button variant="outline">Manage Privacy</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}