import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { useBusinesses } from '@/hooks/useBusinesses';
import { QRCodeModal } from '@/components/products/QRCodeDisplay';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { formatINR } from '@/lib/formatCurrency';
import { 
  Search, 
  Package, 
  Building2, 
  Filter,
  QrCode,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'react-router-dom';

const ProductFinder = () => {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: businesses = [], isLoading: businessesLoading } = useBusinesses();
  const [searchParams] = useSearchParams();
  
  const isLoading = productsLoading || businessesLoading;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState(searchParams.get('business') || 'all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'low-stock'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => [...new Set(products.map(p => p.category))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBusiness = selectedBusiness === 'all' || p.business_id === selectedBusiness;
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      
      // Price ranges in INR
      const matchesPrice = priceRange === 'all' ||
        (priceRange === 'low' && p.price < 500) ||
        (priceRange === 'mid' && p.price >= 500 && p.price < 2000) ||
        (priceRange === 'high' && p.price >= 2000);
      
      const matchesStock = stockFilter === 'all' ||
        (stockFilter === 'in-stock' && p.current_stock > p.min_stock) ||
        (stockFilter === 'low-stock' && p.current_stock <= p.min_stock && p.current_stock > 0);

      return matchesSearch && matchesBusiness && matchesCategory && matchesPrice && matchesStock;
    });
  }, [products, searchQuery, selectedBusiness, selectedCategory, priceRange, stockFilter]);

  const activeFiltersCount = [
    selectedBusiness !== 'all',
    selectedCategory !== 'all',
    priceRange !== 'all',
    stockFilter !== 'all'
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedBusiness('all');
    setSelectedCategory('all');
    setPriceRange('all');
    setStockFilter('all');
  };

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity === 0) return { label: 'Out of Stock', class: 'badge-danger' };
    if (quantity <= minStock) return { label: 'Low Stock', class: 'badge-warning' };
    return { label: 'In Stock', class: 'badge-success' };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 lg:p-8">
        <div className="mb-8">
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <Skeleton className="h-16 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <Skeleton key={i} className="h-64" />
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Product Finder</h1>
        <p className="text-muted-foreground">
          Search and discover products across all local businesses.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 mb-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search products, SKUs, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 search-input text-lg h-12"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn("gap-2", activeFiltersCount > 0 && "border-primary text-primary")}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="glass-card p-4 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Filters</h3>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                <X className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Business</label>
              <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
                <SelectTrigger>
                  <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="All Businesses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Businesses</SelectItem>
                  {businesses.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Price Range</label>
              <Select value={priceRange} onValueChange={(v) => setPriceRange(v as typeof priceRange)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="low">Under ₹500</SelectItem>
                  <SelectItem value="mid">₹500 - ₹2,000</SelectItem>
                  <SelectItem value="high">Over ₹2,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Availability</label>
              <Select value={stockFilter} onValueChange={(v) => setStockFilter(v as typeof stockFilter)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="in-stock">In Stock Only</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}
          {searchQuery && <span> for "<span className="text-primary">{searchQuery}</span>"</span>}
        </p>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-16"
          >
            <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </motion.div>
        ) : (
          filteredProducts.map((product, index) => {
            const status = getStockStatus(product.current_stock, product.min_stock);
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="glass-card-hover p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <span className={cn("text-xs font-medium px-2 py-1 rounded-full", status.class)}>
                    {status.label}
                  </span>
                </div>

                <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-xs font-mono text-muted-foreground mb-2">{product.sku}</p>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description || 'No description'}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    {product.category}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Building2 className="w-3 h-3" />
                    <span className="truncate max-w-[100px]">{product.business_name}</span>
                  </div>
                  <p className="font-bold text-primary">{formatINR(product.price)}</p>
                </div>

                <div className="mt-3 flex gap-2">
                  <QRCodeModal
                    product={product}
                    trigger={
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <QrCode className="w-3 h-3" />
                        QR Code
                      </Button>
                    }
                  />
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProductFinder;
