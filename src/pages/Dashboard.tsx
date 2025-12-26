import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { useBusinesses } from '@/hooks/useBusinesses';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { LowStockAlert } from '@/components/dashboard/LowStockAlert';
import { Package, Building2, AlertTriangle, TrendingUp, QrCode, ShoppingCart } from 'lucide-react';
import { formatINR } from '@/lib/formatCurrency';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: businesses = [], isLoading: businessesLoading } = useBusinesses();
  
  const isLoading = productsLoading || businessesLoading;
  
  const totalProducts = products.length;
  const totalBusinesses = businesses.length;
  const lowStockCount = products.filter(p => p.current_stock <= p.min_stock).length;
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.current_stock), 0);
  const totalItems = products.reduce((sum, p) => sum + p.current_stock, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 lg:p-8">
        <div className="mb-8">
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your inventory.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={totalProducts}
          subtitle={`${totalItems} total items in stock`}
          icon={Package}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Businesses"
          value={totalBusinesses}
          subtitle="Active local businesses"
          icon={Building2}
          variant="info"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockCount}
          subtitle="Products need restocking"
          icon={AlertTriangle}
          variant={lowStockCount > 0 ? 'warning' : 'success'}
        />
        <StatCard
          title="Inventory Value"
          value={formatINR(totalInventoryValue)}
          subtitle="Total estimated value"
          icon={TrendingUp}
          variant="success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <LowStockAlert />
        
        {/* Recent Activity */}
        <RecentActivity />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="mt-8"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a 
            href="/products" 
            className="glass-card-hover p-6 flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Manage Products</p>
              <p className="text-sm text-muted-foreground">Add, edit, or remove products</p>
            </div>
          </a>
          <a 
            href="/scanner" 
            className="glass-card-hover p-6 flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
              <QrCode className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Scan QR Code</p>
              <p className="text-sm text-muted-foreground">Quick inventory lookup</p>
            </div>
          </a>
          <a 
            href="/finder" 
            className="glass-card-hover p-6 flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center group-hover:bg-success/30 transition-colors">
              <ShoppingCart className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Find Products</p>
              <p className="text-sm text-muted-foreground">Search across all businesses</p>
            </div>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
