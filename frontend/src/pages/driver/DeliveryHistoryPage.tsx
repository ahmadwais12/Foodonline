import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Filter, Package, CheckCircle, Clock, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data
const deliveryHistory = [
  {
    id: '#ORD-3210',
    customer: 'John Doe',
    restaurant: 'Italian Bistro',
    amount: '$27.50',
    date: '2023-06-15',
    time: '14:30',
    status: 'delivered',
    deliveryTime: '25 min',
    tip: '$3.00',
  },
  {
    id: '#ORD-3209',
    customer: 'Jane Smith',
    restaurant: 'Burger Palace',
    amount: '$21.25',
    date: '2023-06-15',
    time: '12:15',
    status: 'delivered',
    deliveryTime: '20 min',
    tip: '$2.50',
  },
  {
    id: '#ORD-3208',
    customer: 'Robert Johnson',
    restaurant: 'Sushi Corner',
    amount: '$37.00',
    date: '2023-06-14',
    time: '19:45',
    status: 'delivered',
    deliveryTime: '30 min',
    tip: '$5.00',
  },
  {
    id: '#ORD-3207',
    customer: 'Emily Davis',
    restaurant: 'Pizza Hut',
    amount: '$16.75',
    date: '2023-06-14',
    time: '18:30',
    status: 'delivered',
    deliveryTime: '22 min',
    tip: '$2.00',
  },
  {
    id: '#ORD-3206',
    customer: 'Michael Wilson',
    restaurant: 'Taco Fiesta',
    amount: '$22.50',
    date: '2023-06-13',
    time: '20:15',
    status: 'delivered',
    deliveryTime: '18 min',
    tip: '$4.00',
  },
  {
    id: '#ORD-3205',
    customer: 'Sarah Johnson',
    restaurant: 'Burger Palace',
    amount: '$19.80',
    date: '2023-06-13',
    time: '19:00',
    status: 'delivered',
    deliveryTime: '24 min',
    tip: '$3.50',
  },
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function DeliveryHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredDeliveries = deliveryHistory.filter(delivery => {
    const matchesSearch = 
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.restaurant.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-success/10 text-success">Delivered</Badge>;
      case 'cancelled':
        return <Badge className="bg-destructive/10 text-destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Delivery History</h1>
            <p className="text-muted-foreground">
              View your past deliveries
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search deliveries..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Deliveries</p>
                  <p className="text-2xl font-bold">142</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Euro className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">$2,847</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Delivery Time</p>
                  <p className="text-2xl font-bold">22 min</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted/10 rounded-lg">
                  <Euro className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Tip</p>
                  <p className="text-2xl font-bold">$3.20</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery History Table */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Records</CardTitle>
            <CardDescription>
              {filteredDeliveries.length} deliveries found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Restaurant</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Delivery Time</TableHead>
                  <TableHead>Tip</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">{delivery.id}</TableCell>
                    <TableCell>{delivery.customer}</TableCell>
                    <TableCell>{delivery.restaurant}</TableCell>
                    <TableCell>{delivery.amount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {delivery.date} {delivery.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(delivery.status)}
                        {getStatusBadge(delivery.status)}
                      </div>
                    </TableCell>
                    <TableCell>{delivery.deliveryTime}</TableCell>
                    <TableCell className="text-success">{delivery.tip}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}