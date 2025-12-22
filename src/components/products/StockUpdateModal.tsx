import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInventoryStore, Product } from '@/store/inventoryStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { ArrowUpCircle, ArrowDownCircle, Package } from 'lucide-react';

interface StockUpdateModalProps {
  product: Product;
  trigger: React.ReactNode;
}

export function StockUpdateModal({ product, trigger }: StockUpdateModalProps) {
  const { updateStock } = useInventoryStore();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'in' | 'out'>('in');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (type === 'out' && quantity > product.quantity) {
      toast.error('Insufficient stock');
      return;
    }

    updateStock(product.id, quantity, type, reason || (type === 'in' ? 'Stock added' : 'Stock removed'));
    
    toast.success(
      type === 'in' 
        ? `Added ${quantity} units to ${product.name}` 
        : `Removed ${quantity} units from ${product.name}`
    );
    
    setOpen(false);
    setQuantity(1);
    setReason('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Stock</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg mb-4">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{product.name}</p>
            <p className="text-sm text-muted-foreground">
              Current stock: <span className="font-mono font-bold">{product.quantity}</span> units
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup 
            value={type} 
            onValueChange={(value) => setType(value as 'in' | 'out')}
            className="grid grid-cols-2 gap-4"
          >
            <Label
              htmlFor="stock-in"
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                type === 'in' 
                  ? 'border-success bg-success/10' 
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <RadioGroupItem value="in" id="stock-in" />
              <ArrowUpCircle className={`w-5 h-5 ${type === 'in' ? 'text-success' : 'text-muted-foreground'}`} />
              <span className="font-medium">Stock In</span>
            </Label>
            <Label
              htmlFor="stock-out"
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                type === 'out' 
                  ? 'border-warning bg-warning/10' 
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <RadioGroupItem value="out" id="stock-out" />
              <ArrowDownCircle className={`w-5 h-5 ${type === 'out' ? 'text-warning' : 'text-muted-foreground'}`} />
              <span className="font-medium">Stock Out</span>
            </Label>
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={type === 'out' ? product.quantity : undefined}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className="text-lg font-mono"
            />
            {type === 'out' && (
              <p className="text-xs text-muted-foreground">
                Maximum: {product.quantity} units
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={type === 'in' ? 'e.g., New shipment received' : 'e.g., Customer order'}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className={type === 'in' ? 'bg-success hover:bg-success/90' : 'bg-warning hover:bg-warning/90'}
            >
              {type === 'in' ? 'Add' : 'Remove'} Stock
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
