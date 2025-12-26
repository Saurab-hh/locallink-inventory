import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBusinesses, useDeleteBusiness } from '@/hooks/useBusinesses';
import { useProducts } from '@/hooks/useProducts';
import { BusinessForm } from '@/components/businesses/BusinessForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Building2, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Package,
  Trash2,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Link } from 'react-router-dom';

const Businesses = () => {
  const { data: businesses = [], isLoading } = useBusinesses();
  const { data: products = [] } = useProducts();
  const deleteBusiness = useDeleteBusiness();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBusinesses = businesses.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getBusinessProductCount = (businessId: string) => {
    return products.filter(p => p.business_id === businessId).length;
  };

  const handleDelete = (id: string) => {
    deleteBusiness.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 lg:p-8">
        <div className="mb-8">
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <Skeleton className="h-16 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-72" />
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Business Directory</h1>
            <p className="text-muted-foreground">
              Manage local businesses and their product listings.
            </p>
          </div>
          <BusinessForm />
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 mb-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search businesses by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 search-input"
          />
        </div>
      </motion.div>

      {/* Businesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBusinesses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-16"
          >
            <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No businesses found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search' : 'Add your first business to get started'}
            </p>
            <BusinessForm />
          </motion.div>
        ) : (
          filteredBusinesses.map((business, index) => {
            const productCount = getBusinessProductCount(business.id);
            return (
              <motion.div
                key={business.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card-hover overflow-hidden"
              >
                {/* Header with gradient */}
                <div className="h-24 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent relative">
                  <div className="absolute -bottom-8 left-6">
                    <div className="w-16 h-16 rounded-xl bg-card border-4 border-card flex items-center justify-center shadow-lg">
                      <Building2 className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/50 hover:bg-background/80">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/finder?business=${business.id}`}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Products
                          </Link>
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem 
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Business
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Business</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{business.name}"? This will also delete all associated products.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(business.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-12">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{business.name}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                        {business.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Package className="w-4 h-4" />
                      <span className="text-sm font-medium">{productCount}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    Owner: {business.owner}
                  </p>

                  <div className="space-y-2 text-sm">
                    {business.address && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{business.address}</span>
                      </div>
                    )}
                    {business.contact && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span>{business.contact}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Businesses;
