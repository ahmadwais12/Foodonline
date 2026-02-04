import { createContext, useContext, useState, ReactNode } from 'react';
import { UserAddress } from '@/types';
import { userService } from '@/services/user.service';

interface UserContextType {
  addresses: UserAddress[];
  loading: boolean;
  error: string | null;
  fetchUserAddresses: (userId: string) => Promise<void>;
  addAddress: (address: Omit<UserAddress, 'id' | 'created_at'>) => Promise<UserAddress | null>;
  updateAddress: (addressId: string, address: Partial<UserAddress>) => Promise<boolean>;
  deleteAddress: (addressId: string) => Promise<boolean>;
  setDefaultAddress: (userId: string, addressId: string) => Promise<boolean>;
  clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const fetchUserAddresses = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const userAddresses = await userService.getAddresses(userId);
      setAddresses(userAddresses);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch addresses');
      console.error('Failed to fetch addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (address: Omit<UserAddress, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newAddress = await userService.addAddress(address);
      setAddresses(prev => [...prev, newAddress]);
      return newAddress;
    } catch (err: any) {
      setError(err.message || 'Failed to add address');
      console.error('Failed to add address:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (addressId: string, address: Partial<UserAddress>) => {
    setLoading(true);
    setError(null);
    try {
      await userService.updateAddress(addressId, address);
      setAddresses(prev => 
        prev.map(addr => addr.id === addressId ? { ...addr, ...address } : addr)
      );
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update address');
      console.error('Failed to update address:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (addressId: string) => {
    setLoading(true);
    setError(null);
    try {
      await userService.deleteAddress(addressId);
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete address');
      console.error('Failed to delete address:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const setDefaultAddress = async (userId: string, addressId: string) => {
    setLoading(true);
    setError(null);
    try {
      await userService.setDefaultAddress(userId, addressId);
      setAddresses(prev => 
        prev.map(addr => ({
          ...addr,
          is_default: addr.id === addressId
        }))
      );
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to set default address');
      console.error('Failed to set default address:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        addresses,
        loading,
        error,
        fetchUserAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        clearError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}