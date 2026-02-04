import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, Download, TrendingUp, Euro, Package, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data
const earningsData = {
  totalEarnings: 2847.50,
  totalTips: 452.30,
  totalDeliveries: 142,
  avgDeliveryTime: '22 min',
  avgTip: 3.20,
};

const weeklyEarnings = [
  { day: 'Mon', date: 'Jun 12', earnings: 120.50, tips: 18.20, deliveries: 8 },
  { day: 'Tue', date: 'Jun 13', earnings: 156.75, tips: 24.50, deliveries: 10 },
  { day: 'Wed', date: 'Jun 14', earnings: 189.25, tips: 28.75, deliveries: 12 },
  { day: 'Thu', date: 'Jun 15', earnings: 167.80, tips: 25.30, deliveries: 11 },
  { day: 'Fri', date: 'Jun 16', earnings: 201.40, tips: 32.10, deliveries: 13 },
  { day: 'Sat', date: 'Jun 17', earnings: 245.60, tips: 38.40, deliveries: 15 },
  { day: 'Sun', date: 'Jun 18', earnings: 189.30, tips: 29.60, deliveries: 12 },
];

const recentTransactions = [
  { id: '#TXN-1001', date: '2023-06-18', amount: '$245.60', type: 'Weekly Earnings', status: 'completed' },
  { id: '#TXN-1000', date: '2023-06-17', amount: '$189.30', type: 'Daily Earnings', status: 'completed' },
  { id: '#TXN-0999', date: '2023-06-16', amount: '$201.40', type: 'Daily Earnings', status: 'completed' },
  { id: '#TXN-0998', date: '2023-06-15', amount: '$167.80', type: 'Daily Earnings', status: 'completed' },
  { id: '#TXN-0997', date: '2023-06-14', amount: '$189.25', type: 'Daily Earnings', status: 'completed' },
];

export default function EarningsPage() {
  const [dateFilter, setDateFilter] = useState('this_week');

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Earnings</h1>
            <p className="text-muted-foreground">
              Track your income and financial performance
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
                <SelectItem value="last_week">Last Week</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${earningsData.totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+12.5% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tips</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${earningsData.totalTips.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+8.3% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{earningsData.totalDeliveries}</div>
              <p className="text-xs text-muted-foreground">+5.2% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Tip</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${earningsData.avgTip.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+2.1% from last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Earnings Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
                <CardDescription>
                  Your earnings and tips for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Earnings chart visualization would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
              <CardDescription>
                Daily breakdown of your earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyEarnings.map((day) => (
                  <div key={day.day} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{day.day}</p>
                      <p className="text-sm text-muted-foreground">{day.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${day.earnings.toFixed(2)}</p>
                      <p className="text-sm text-success">+${day.tips.toFixed(2)} tips</p>
                      <p className="text-xs text-muted-foreground">{day.deliveries} deliveries</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your latest earnings and payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{transaction.id}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    <Badge variant="secondary" className="mt-1">
                      {transaction.type}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{transaction.amount}</p>
                    <Badge className="bg-success/10 text-success mt-1">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}