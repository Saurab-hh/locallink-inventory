import { motion } from 'framer-motion';
import { useInventoryStore } from '@/store/inventoryStore';
import { StockUpdateModal } from '@/components/products/StockUpdateModal';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Package, 
  TrendingDown,
  ArrowUpCircle,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const StockAlerts = () => {
  const { products } = useInventoryStore();
  
  const lowStockProducts = products
    .filter(p => p.quantity <= p.minStock)
    .sort((a, b) => a.quantity - b.quantity);

  const outOfStockProducts = lowStockProducts.filter(p => p.quantity === 0);
  const criticalProducts = lowStockProducts.filter(p => p.quantity > 0 && p.quantity <= p.minStock * 0.5);
  const warningProducts = lowStockProducts.filter(p => p.quantity > p.minStock * 0.5 && p.quantity <= p.minStock);

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Stock Alerts</h1>
        <p className="text-muted-foreground">
          Monitor and manage low stock and out-of-stock items.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 border-destructive/30 bg-destructive/5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-3xl font-bold text-destructive">{outOfStockProducts.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
              <Package className="w-6 h-6 text-destructive" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6 border-warning/30 bg-warning/5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Critical Low</p>
              <p className="text-3xl font-bold text-warning">{criticalProducts.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 border-info/30 bg-info/5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-3xl font-bold text-info">{warningProducts.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-info/20 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-info" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Alert List */}
      {lowStockProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-success" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">All Stock Levels Normal</h3>
          <p className="text-muted-foreground mb-6">
            No products are currently below their minimum stock levels.
          </p>
          <Link to="/products">
            <Button>View All Products</Button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {lowStockProducts.map((product, index) => {
            const isOutOfStock = product.quantity === 0;
            const isCritical = product.quantity > 0 && product.quantity <= product.minStock * 0.5;
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-4",
                  isOutOfStock && "border-destructive/30 bg-destructive/5",
                  isCritical && !isOutOfStock && "border-warning/30 bg-warning/5",
                  !isOutOfStock && !isCritical && "border-info/30 bg-info/5"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                  isOutOfStock && "bg-destructive/20",
                  isCritical && !isOutOfStock && "bg-warning/20",
                  !isOutOfStock && !isCritical && "bg-info/20"
                )}>
                  <Package className={cn(
                    "w-6 h-6",
                    isOutOfStock && "text-destructive",
                    isCritical && !isOutOfStock && "text-warning",
                    !isOutOfStock && !isCritical && "text-info"
                  )} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-foreground">{product.name}</h4>
                      <p className="text-sm font-mono text-muted-foreground">{product.sku}</p>
                    </div>
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full flex-shrink-0",
                      isOutOfStock && "badge-danger",
                      isCritical && !isOutOfStock && "badge-warning",
                      !isOutOfStock && !isCritical && "badge-info"
                    )}>
                      {isOutOfStock ? 'Out of Stock' : isCritical ? 'Critical' : 'Low Stock'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                      {product.businessName}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Stock: </span>
                      <span className={cn(
                        "font-bold",
                        isOutOfStock && "text-destructive",
                        isCritical && !isOutOfStock && "text-warning",
                        !isOutOfStock && !isCritical && "text-info"
                      )}>
                        {product.quantity}
                      </span>
                      <span className="text-muted-foreground"> / {product.minStock} min</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 sm:flex-shrink-0">
                  <StockUpdateModal
                    product={product}
                    trigger={
                      <Button size="sm" className="gap-1">
                        <ArrowUpCircle className="w-4 h-4" />
                        Add Stock
                      </Button>
                    }
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StockAlerts;
