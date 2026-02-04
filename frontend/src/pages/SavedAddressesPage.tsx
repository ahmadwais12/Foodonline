import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Edit, Trash2, Home, Building, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AddressDialog from '@/components/user/AddressDialog';

interface Address {
  id: string;
  title: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

const mockAddresses: Address[] = [
  {
    id: '1',
    title: 'Home',
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    isDefault: true,
    type: 'home'
  },
  {
    id: '2',
    title: 'Work',
    street: '456 Business Ave, Suite 100',
    city: 'New York',
    state: 'NY',
    zipCode: '10002',
    isDefault: false,
    type: 'work'
  },
  {
    id: '3',
    title: 'Parent\'s House',
    street: '789 Family Road',
    city: 'Brooklyn',
    state: 'NY',
    zipCode: '11201',
    isDefault: false,
    type: 'other'
  }
];

export default function SavedAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsDialogOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(address => address.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(address => ({
      ...address,
      isDefault: address.id === id
    })));
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-4 w-4" />;
      case 'work': return <Building className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getAddressTypeColor = (type: string) => {
    switch (type) {
      case 'home': return 'bg-primary/10 text-primary';
      case 'work': return 'bg-success/10 text-success';
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
            <h1 className="text-3xl font-bold">Saved Addresses</h1>
            <p className="text-muted-foreground">
              Manage your delivery addresses
            </p>
          </div>
          <Button onClick={handleAddAddress}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Button>
        </div>

        {addresses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="bg-muted p-4 rounded-full mb-4">
              <MapPin className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No saved addresses</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              You haven't saved any addresses yet. Add your first address to get started.
            </p>
            <Button onClick={handleAddAddress}>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addresses.map((address) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {getAddressTypeIcon(address.type)}
                        {address.title}
                      </CardTitle>
                      {address.isDefault && (
                        <Badge variant="default">Default</Badge>
                      )}
                    </div>
                    <CardDescription>
                      <Badge className={getAddressTypeColor(address.type)}>
                        {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground">
                      {address.street}
                      <br />
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                  </CardContent>
                  <div className="p-4 pt-0 flex flex-wrap gap-2">
                    {!address.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditAddress(address)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <AddressDialog 
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </motion.div>
    </div>
  );
}