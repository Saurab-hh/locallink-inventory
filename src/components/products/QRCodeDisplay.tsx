import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Product } from '@/hooks/useProducts';

interface QRCodeDisplayProps {
  product: Product;
  size?: number;
}

export function QRCodeDisplay({ product, size = 200 }: QRCodeDisplayProps) {
  const qrData = JSON.stringify({
    id: product.id,
    sku: product.sku,
    name: product.name,
    business: product.business_name,
  });

  const handleDownload = () => {
    const svg = document.getElementById(`qr-${product.id}`);
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = size;
        canvas.height = size;
        ctx?.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.download = `qr-${product.sku}.png`;
        link.href = canvas.toDataURL();
        link.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="qr-container shadow-lg">
        <QRCodeSVG
          id={`qr-${product.id}`}
          value={qrData}
          size={size}
          level="H"
          includeMargin={false}
          bgColor="#FFFFFF"
          fgColor="#0a0f1c"
        />
      </div>
      <div className="text-center">
        <p className="font-mono text-sm text-muted-foreground">{product.sku}</p>
        <p className="font-medium text-foreground">{product.name}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
}

interface QRCodeModalProps {
  product: Product;
  trigger: React.ReactNode;
}

export function QRCodeModal({ product, trigger }: QRCodeModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Product QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center py-6">
          <QRCodeDisplay product={product} size={250} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
