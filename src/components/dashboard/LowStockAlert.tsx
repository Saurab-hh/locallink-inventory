import { motion } from 'framer-motion';
import { useInventoryStore } from '@/store/inventoryStore';
import { AlertTriangle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function LowStockAlert() {
  const { products } = useInventoryStore();
  const lowStockProducts = products.filter(p => p.quantity <= p.minStock);

  if (lowStockProducts.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card p-6 border-warning/30 bg-warning/5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Low Stock Alert</h3>
            <p className="text-sm text-muted-foreground">
              {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} need attention
            </p>
          </div>
        </div>
        <Link to="/alerts">
          <Button variant="ghost" size="sm" className="text-warning hover:text-warning/80">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {lowStockProducts.slice(0, 3).map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg bg-background/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                <Package className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.businessName}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-warning">{product.quantity}</p>
              <p className="text-xs text-muted-foreground">Min: {product.minStock}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
