import { motion } from 'framer-motion';
import { useInventoryStore, StockMovement } from '@/store/inventoryStore';
import { Package, ArrowUpCircle, ArrowDownCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function RecentActivity() {
  const { stockMovements } = useInventoryStore();
  const recentMovements = stockMovements.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <Clock className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {recentMovements.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No recent activity
          </p>
        ) : (
          recentMovements.map((movement, index) => (
            <motion.div
              key={movement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                movement.type === 'in' 
                  ? "bg-success/20 text-success" 
                  : "bg-warning/20 text-warning"
              )}>
                {movement.type === 'in' ? (
                  <ArrowUpCircle className="w-5 h-5" />
                ) : (
                  <ArrowDownCircle className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">
                  {movement.productName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {movement.type === 'in' ? '+' : '-'}{movement.quantity} units • {movement.reason}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(movement.createdAt, { addSuffix: true })}
              </span>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
