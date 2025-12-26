import { useState } from 'react';
import { useCreateProduct, useUpdateProduct, Product, ProductFormData } from '@/hooks/useProducts';
import { Business } from '@/hooks/useBusinesses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Save } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
  businesses: Business[];
  onSuccess?: () => void;
}

export function ProductForm({ product, businesses, onSuccess }: ProductFormProps) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    category: product?.category || '',
    current_stock: product?.current_stock || 0,
    min_stock: product?.min_stock || 10,
    price: product?.price || 0,
    business_id: product?.business_id || '',
    description: product?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sku || !formData.business_id) {
      return;
    }

    const productData: ProductFormData = {
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      current_stock: formData.current_stock,
      min_stock: formData.min_stock,
      price: formData.price,
      business_id: formData.business_id,
      description: formData.description,
    };

    if (product) {
      updateProduct.mutate({ id: product.id, ...productData }, {
        onSuccess: () => {
          setOpen(false);
          onSuccess?.();
        }
      });
    } else {
      createProduct.mutate(productData, {
        onSuccess: () => {
          setOpen(false);
          setFormData({
            name: '',
            sku: '',
            category: '',
            current_stock: 0,
            min_stock: 10,
            price: 0,
            business_id: '',
            description: '',
          });
          onSuccess?.();
        }
      });
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {product ? (
          <Button variant="ghost" size="sm">Edit</Button>
        ) : (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleChange('sku', e.target.value.toUpperCase())}
                placeholder="e.g., PROD-001"
                className="font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="business">Business *</Label>
              <Select
                value={formData.business_id}
                onValueChange={(value) => handleChange('business_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business" />
                </SelectTrigger>
                <SelectContent>
                  {businesses.map((business) => (
                    <SelectItem key={business.id} value={business.id}>
                      {business.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current_stock">Quantity</Label>
              <Input
                id="current_stock"
                type="number"
                min="0"
                value={formData.current_stock}
                onChange={(e) => handleChange('current_stock', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_stock">Min Stock</Label>
              <Input
                id="min_stock"
                type="number"
                min="0"
                value={formData.min_stock}
                onChange={(e) => handleChange('min_stock', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="gap-2"
              disabled={createProduct.isPending || updateProduct.isPending}
            >
              <Save className="w-4 h-4" />
              {product ? 'Update' : 'Add'} Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
