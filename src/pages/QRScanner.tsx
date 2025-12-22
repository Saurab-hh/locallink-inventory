import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInventoryStore, Product } from '@/store/inventoryStore';
import { QRCodeDisplay } from '@/components/products/QRCodeDisplay';
import { StockUpdateModal } from '@/components/products/StockUpdateModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  QrCode, 
  Camera, 
  Package, 
  Search,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const QRScanner = () => {
  const { products } = useInventoryStore();
  const [manualInput, setManualInput] = useState('');
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'found' | 'not-found'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  // Simulate QR scanner - in real app would use camera
  const handleScan = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      const product = products.find(p => p.id === parsed.id || p.sku === parsed.sku);
      
      if (product) {
        setFoundProduct(product);
        setScanStatus('found');
        toast.success(`Found: ${product.name}`);
      } else {
        setScanStatus('not-found');
        toast.error('Product not found');
      }
    } catch {
      // Try direct SKU lookup
      const product = products.find(p => 
        p.sku.toLowerCase() === data.toLowerCase() || 
        p.id === data
      );
      
      if (product) {
        setFoundProduct(product);
        setScanStatus('found');
        toast.success(`Found: ${product.name}`);
      } else {
        setScanStatus('not-found');
        toast.error('Product not found');
      }
    }
  };

  const handleManualSearch = () => {
    if (!manualInput.trim()) return;
    handleScan(manualInput);
  };

  const resetScanner = () => {
    setFoundProduct(null);
    setManualInput('');
    setScanStatus('idle');
  };

  // Auto-focus input for barcode scanner compatibility
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">QR Scanner</h1>
        <p className="text-muted-foreground">
          Scan QR codes to quickly look up and update product inventory.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Camera Preview (Simulated) */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Scan QR Code
            </h3>
            
            <div className="aspect-square max-w-sm mx-auto bg-muted/50 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center p-8 relative overflow-hidden">
              <div className="absolute inset-4 border-2 border-primary/30 rounded-lg">
                {/* Scanning animation lines */}
                <motion.div
                  animate={{ y: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                />
              </div>
              
              <QrCode className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground text-center">
                Position QR code within the frame
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Camera access required for live scanning
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground mb-2">
                Or use manual entry below for barcode scanners
              </p>
            </div>
          </div>

          {/* Manual Input */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Manual Lookup
            </h3>
            
            <div className="flex gap-3">
              <Input
                ref={inputRef}
                placeholder="Enter SKU or scan barcode..."
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                className="font-mono search-input"
              />
              <Button onClick={handleManualSearch} disabled={!manualInput.trim()}>
                Lookup
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-3">
              Tip: Use a USB barcode scanner to auto-fill this field
            </p>
          </div>

          {/* Quick Access - Recent Products */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Quick Access</h3>
            <div className="grid grid-cols-2 gap-2">
              {products.slice(0, 4).map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    setFoundProduct(product);
                    setScanStatus('found');
                  }}
                  className="p-3 rounded-lg bg-muted/50 hover:bg-muted text-left transition-colors"
                >
                  <p className="font-medium text-sm text-foreground truncate">{product.name}</p>
                  <p className="text-xs font-mono text-muted-foreground">{product.sku}</p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Result Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {foundProduct ? (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <h3 className="font-semibold text-foreground">Product Found</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={resetScanner}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                {/* QR Code */}
                <div className="flex justify-center">
                  <QRCodeDisplay product={foundProduct} size={150} />
                </div>

                {/* Product Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-xl font-bold text-foreground">{foundProduct.name}</h4>
                    <p className="text-sm font-mono text-muted-foreground">{foundProduct.sku}</p>
                  </div>

                  <p className="text-sm text-muted-foreground">{foundProduct.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Current Stock</p>
                      <p className={cn(
                        "text-2xl font-bold",
                        foundProduct.quantity <= foundProduct.minStock ? "text-warning" : "text-success"
                      )}>
                        {foundProduct.quantity}
                      </p>
                      <p className="text-xs text-muted-foreground">Min: {foundProduct.minStock}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="text-2xl font-bold text-primary">${foundProduct.price.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{foundProduct.category}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Business</p>
                    <p className="font-medium text-foreground">{foundProduct.businessName}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <StockUpdateModal
                      product={foundProduct}
                      trigger={
                        <Button className="flex-1">Update Stock</Button>
                      }
                    />
                    <Button variant="outline" onClick={resetScanner}>
                      Scan Another
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : scanStatus === 'not-found' ? (
            <div className="glass-card p-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Product Not Found</h3>
                <p className="text-muted-foreground mb-6">
                  The scanned QR code doesn't match any product in the system.
                </p>
                <Button onClick={resetScanner}>Try Again</Button>
              </div>
            </div>
          ) : (
            <div className="glass-card p-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 animate-pulse-slow">
                  <QrCode className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Scan</h3>
                <p className="text-muted-foreground">
                  Scan a QR code or enter a SKU to look up product details
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QRScanner;
