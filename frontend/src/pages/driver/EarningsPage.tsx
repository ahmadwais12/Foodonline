import { useState, useEffect } from 'react';
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

export default function EarningsPage() {
  const [dateFilter, setDateFilter] = useState('this_week');
  const [earningsData, setEarningsData] = useState({
    totalEarnings: 0,
    totalTips: 0,
    totalDeliveries: 0,
    avgDeliveryTime: '-',
    avgTip: 0,
  });
  const [weeklyEarnings, setWeeklyEarnings] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when backend endpoint is ready
      // const data = await driverService.getEarnings();
      // setEarningsData(data.summary);
      // setWeeklyEarnings(data.weekly);
      // setRecentTransactions(data.transactions);
      setEarningsData({
        totalEarnings: 0,
        totalTips: 0,
        totalDeliveries: 0,
        avgDeliveryTime: '-',
        avgTip: 0,
      });
      setWeeklyEarnings([]);
      setRecentTransactions([]);
    } catch (error) {
      console.error('Failed to load earnings:', error);
    } finally {
      setLoading(false);
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