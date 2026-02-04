import { useState, useEffect } from 'react';
import { 
  Ticket, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Plus, 
  Trash2,
  Calendar,
  Percent,
  DollarSign,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { adminService } from '@/services/admin.service';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: string;
  discount_value: number;
  min_order_value: number;
  max_discount: number;
  valid_from: string;
  valid_until: string;
  usage_limit: number;
  used_count: number;
  created_at: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      // For now, we'll simulate loading coupons
      // In a real implementation, we'd call adminService.getCoupons()
      setCoupons([
        {
          id: '1',
          code: 'SAVE20',
          description: '20% off on orders above $30',
          discount_type: 'percentage',
          discount_value: 20,
          min_order_value: 30,
          max_discount: 10,
          valid_from: new Date(Date.now() - 86400000).toISOString(),
          valid_until: new Date(Date.now() + 2592000000).toISOString(),
          usage_limit: 100,
          used_count: 25,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          code: 'WELCOME10',
          description: 'First order discount',
          discount_type: 'percentage',
          discount_value: 10,
          min_order_value: 0,
          max_discount: 5,
          valid_from: new Date().toISOString(),
          valid_until: new Date(Date.now() + 2592000000).toISOString(),
          usage_limit: 500,
          used_count: 120,
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          code: 'FREESHIP',
          description: 'Free shipping on orders above $50',
          discount_type: 'fixed',
          discount_value: 5,
          min_order_value: 50,
          max_discount: 5,
          valid_from: new Date().toISOString(),
          valid_until: new Date(Date.now() + 2592000000).toISOString(),
          usage_limit: 200,
          used_count: 80,
          created_at: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Failed to load coupons:', error);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCoupons = coupons.filter(coupon => 
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const isCouponActive = (coupon: Coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.valid_from);
    const validUntil = new Date(coupon.valid_until);
    return now >= validFrom && now <= validUntil && coupon.used_count < coupon.usage_limit;
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
            <Ticket className="h-8 w-8 text-primary" />
            Coupon Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage discount codes and promotions
          </p>
        </div>
        
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Coupons</p>
                <p className="text-2xl font-bold">{coupons.length}</p>
              </div>
              <Ticket className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{coupons.filter(c => isCouponActive(c)).length}</p>
              </div>
              <Ticket className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Used</p>
                <p className="text-2xl font-bold">{coupons.reduce((sum, c) => sum + c.used_count, 0)}</p>
              </div>
              <Users className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Discount</p>
                <p className="text-2xl font-bold">
                  {coupons.length > 0 
                    ? coupons.reduce((sum, c) => sum + c.discount_value, 0) / coupons.length
                    : 0
                  }%
                </p>
              </div>
              <Percent className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coupons List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Coupons ({filteredCoupons.length})
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Code</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Discount</th>
                  <th className="text-left py-3 px-4">Usage</th>
                  <th className="text-left py-3 px-4">Valid Until</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold bg-muted px-2 py-1 rounded">{coupon.code}</div>
                    </td>
                    <td className="py-3 px-4">
                      {coupon.description}
                    </td>
                    <td className="py-3 px-4">
                      {coupon.discount_type === 'percentage' ? (
                        <div className="flex items-center gap-1">
                          <Percent className="h-4 w-4" />
                          {coupon.discount_value}% off
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {formatCurrency(coupon.discount_value)} off
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {coupon.used_count}/{coupon.usage_limit}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(coupon.valid_until).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={isCouponActive(coupon) ? 'default' : 'destructive'}
                      >
                        {isCouponActive(coupon) ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredCoupons.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No coupons found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}