import { useState } from 'react';
import { useCreateBusiness, useUpdateBusiness, Business, BusinessFormData } from '@/hooks/useBusinesses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Save, Building2 } from 'lucide-react';

interface BusinessFormProps {
  business?: Business;
  onSuccess?: () => void;
}

export function BusinessForm({ business, onSuccess }: BusinessFormProps) {
  const createBusiness = useCreateBusiness();
  const updateBusiness = useUpdateBusiness();
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: business?.name || '',
    owner: business?.owner || '',
    category: business?.category || '',
    address: business?.address || '',
    contact: business?.contact || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.owner || !formData.contact) {
      return;
    }

    const businessData: BusinessFormData = {
      name: formData.name,
      owner: formData.owner,
      category: formData.category,
      address: formData.address,
      contact: formData.contact,
    };

    if (business) {
      updateBusiness.mutate({ id: business.id, ...businessData }, {
        onSuccess: () => {
          setOpen(false);
          onSuccess?.();
        }
      });
    } else {
      createBusiness.mutate(businessData, {
        onSuccess: () => {
          setOpen(false);
          setFormData({
            name: '',
            owner: '',
            category: '',
            address: '',
            contact: '',
          });
          onSuccess?.();
        }
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {business ? (
          <Button variant="ghost" size="sm">Edit</Button>
        ) : (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Business
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            {business ? 'Edit Business' : 'Add New Business'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter business name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner">Owner Name *</Label>
              <Input
                id="owner"
                value={formData.owner}
                onChange={(e) => handleChange('owner', e.target.value)}
                placeholder="Enter owner name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact">Contact (Phone/Email) *</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => handleChange('contact', e.target.value)}
                placeholder="+91 98765 43210"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="e.g., Electronics"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter full address"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="gap-2"
              disabled={createBusiness.isPending || updateBusiness.isPending}
            >
              <Save className="w-4 h-4" />
              {business ? 'Update' : 'Add'} Business
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
