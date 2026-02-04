import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, Trash2, CheckCircle, XCircle, Clock, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'promotion' | 'system' | 'delivery';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Order Confirmed',
    message: 'Your order #12345 has been confirmed and is being prepared.',
    timestamp: '2023-06-15T14:30:00Z',
    read: false,
    type: 'order'
  },
  {
    id: '2',
    title: 'Out for Delivery',
    message: 'Your order #12344 is on its way! Estimated arrival in 15 minutes.',
    timestamp: '2023-06-15T12:15:00Z',
    read: true,
    type: 'delivery'
  },
  {
    id: '3',
    title: 'Special Offer',
    message: 'Get 20% off on your next order from Italian Bistro. Use code: ITALIAN20',
    timestamp: '2023-06-14T09:00:00Z',
    read: false,
    type: 'promotion'
  },
  {
    id: '4',
    title: 'Order Delivered',
    message: 'Your order #12343 has been successfully delivered. How was your experience?',
    timestamp: '2023-06-13T19:45:00Z',
    read: true,
    type: 'order'
  },
  {
    id: '5',
    title: 'System Maintenance',
    message: 'We\'ll be performing scheduled maintenance on Sunday from 2AM-4AM EST.',
    timestamp: '2023-06-12T16:20:00Z',
    read: true,
    type: 'system'
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order': return <CheckCircle className="h-5 w-5 text-primary" />;
      case 'delivery': return <Package className="h-5 w-5 text-success" />;
      case 'promotion': return <Bell className="h-5 w-5 text-warning" />;
      default: return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order': return 'bg-primary/10 text-primary';
      case 'delivery': return 'bg-success/10 text-success';
      case 'promotion': return 'bg-warning/10 text-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` 
                : 'All caught up! No new notifications.'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark All as Read
            </Button>
            <Button 
              variant="outline" 
              onClick={clearAll}
              disabled={notifications.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'unread' ? 'default' : 'outline'} 
            onClick={() => setFilter('unread')}
          >
            Unread
          </Button>
          <Button 
            variant={filter === 'read' ? 'default' : 'outline'} 
            onClick={() => setFilter('read')}
          >
            Read
          </Button>
        </div>

        {filteredNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="bg-muted p-4 rounded-full mb-4">
              <BellOff className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No notifications</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {filter === 'unread' 
                ? "You're all caught up! No unread notifications." 
                : "You don't have any notifications yet."}
            </p>
          </motion.div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                {filteredNotifications.length} notification{filteredNotifications.length > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <AnimatePresence>
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className={`mb-4 p-4 rounded-lg border ${notification.read ? 'bg-muted/30' : 'bg-background'}`}
                    >
                      <div className="flex gap-4">
                        <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold">{notification.title}</h3>
                            {!notification.read && (
                              <Badge variant="default" className="ml-2">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground mt-1">{notification.message}</p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{new Date(notification.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="flex gap-2">
                              {!notification.read && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Mark as Read
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Separator className="mt-4" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}