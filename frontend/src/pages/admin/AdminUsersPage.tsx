import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  User as UserIcon,
  Mail,
  Calendar,
  Shield,
  UserPlus,
  UserCheck,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  User as UserCircle,
  Truck,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { adminService, AdminUser } from '@/services/admin.service';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'customer' | 'driver'>('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getUsers();
      setUsers(data || []);
    } catch (err: any) {
      console.error('Failed to load users:', err);
      setError(err.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      loadUsers();
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleMap: Record<string, { label: string, color: string, bg: string, icon: any }> = {
      admin: { label: 'Administrator', color: 'text-purple-500', bg: 'bg-purple-500/10', icon: ShieldCheck },
      customer: { label: 'Customer', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: UserCircle },
      driver: { label: 'Delivery Partner', color: 'text-orange-500', bg: 'bg-orange-500/10', icon: Truck },
    };
    const r = roleMap[role] || { 
      label: role?.toString() || 'User', 
      color: 'text-gray-500', 
      bg: 'bg-gray-500/10', 
      icon: UserIcon 
    };
    const Icon = r.icon;
    return (
      <Badge className={`${r.bg} ${r.color} border-none rounded-full px-4 py-1.5 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm`}>
        <Icon className="h-3 w-3" />
        {r.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="p-6 min-h-[80vh]">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[80vh] space-y-4">
        <div className="p-4 bg-red-500/10 text-red-500 rounded-2xl flex items-center gap-2 font-bold">
          <AlertCircle className="h-6 w-6" />
          {error}
        </div>
        <Button onClick={loadUsers} className="rounded-full">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <Users className="h-10 w-10 text-primary" />
            User Directory
          </h1>
          <p className="text-muted-foreground text-lg mt-1">
            Manage roles and access for all {users.length} registered users.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full px-6 h-11 border-none bg-muted/50 font-bold">Audit Logs</Button>
          <Button className="gradient-primary rounded-full px-8 shadow-lg shadow-primary/20 h-11 font-bold">
            <UserPlus className="h-5 w-5 mr-2" /> Add User
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Accounts', value: users.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Active Customers', value: users.filter(u => u.role === 'customer').length, icon: UserCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Delivery Staff', value: users.filter(u => u.role === 'driver').length, icon: Truck, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'System Admins', value: users.filter(u => u.role === 'admin').length, icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass-effect border-none shadow-xl rounded-3xl overflow-hidden group">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="glass-effect border-none shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search by username or email address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all text-lg"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-muted/30 px-4 rounded-2xl border border-transparent hover:border-primary/20 transition-all">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as any)}
                  className="bg-transparent h-12 focus:outline-none font-medium text-muted-foreground min-w-[150px]"
                >
                  <option value="all">All Roles</option>
                  <option value="customer">Customers</option>
                  <option value="driver">Drivers</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="glass-effect border-none shadow-xl rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b">
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">User Identity</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Contact Info</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Assigned Role</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Join Date</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user, i) => (
                  <motion.tr 
                    key={user.id} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-muted/10 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <UserIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-black text-lg leading-none mb-1">{user.username}</p>
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">UID: {user.id?.toString().slice(0, 12)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-bold">
                          <Mail className="h-4 w-4 text-primary" />
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 transition-all">
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[180px]">
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold" onClick={() => updateUserRole(user.id, 'customer')}><UserCircle className="h-4 w-4 mr-2 text-blue-500" /> Set as Customer</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold" onClick={() => updateUserRole(user.id, 'driver')}><Truck className="h-4 w-4 mr-2 text-orange-500" /> Set as Driver</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold" onClick={() => updateUserRole(user.id, 'admin')}><ShieldCheck className="h-4 w-4 mr-2 text-purple-500" /> Set as Admin</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold text-red-500 focus:text-red-500"><UserCheck className="h-4 w-4 mr-2" /> Deactivate User</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                          <Eye className="h-5 w-5" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No Users Found</h3>
                <p className="text-muted-foreground text-lg">Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}