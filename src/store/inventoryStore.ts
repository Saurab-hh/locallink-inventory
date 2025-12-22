import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minStock: number;
  price: number;
  businessId: string;
  businessName: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  productsCount: number;
  createdAt: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  createdAt: Date;
}

interface InventoryState {
  products: Product[];
  businesses: Business[];
  stockMovements: StockMovement[];
  searchQuery: string;
  selectedCategory: string;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addBusiness: (business: Omit<Business, 'id' | 'createdAt' | 'productsCount'>) => void;
  updateBusiness: (id: string, updates: Partial<Business>) => void;
  deleteBusiness: (id: string) => void;
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'createdAt'>) => void;
  updateStock: (productId: string, quantity: number, type: 'in' | 'out', reason: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

// Initial mock data
const initialBusinesses: Business[] = [
  {
    id: 'biz1',
    name: 'TechMart Electronics',
    category: 'Electronics',
    address: '123 Main Street, Downtown',
    phone: '+1 555-0123',
    email: 'contact@techmart.com',
    description: 'Your one-stop shop for all electronics and gadgets',
    productsCount: 15,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'biz2',
    name: 'Fresh Grocers',
    category: 'Grocery',
    address: '456 Oak Avenue, Westside',
    phone: '+1 555-0456',
    email: 'hello@freshgrocers.com',
    description: 'Farm-fresh produce and daily essentials',
    productsCount: 42,
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'biz3',
    name: 'Fashion Forward',
    category: 'Clothing',
    address: '789 Style Blvd, Mall District',
    phone: '+1 555-0789',
    email: 'info@fashionforward.com',
    description: 'Trendy fashion for all ages',
    productsCount: 28,
    createdAt: new Date('2024-03-10'),
  },
  {
    id: 'biz4',
    name: 'Home & Living Co.',
    category: 'Home & Garden',
    address: '321 Garden Lane, Suburbia',
    phone: '+1 555-0321',
    email: 'support@homeliving.com',
    description: 'Everything for your home and garden needs',
    productsCount: 35,
    createdAt: new Date('2024-01-28'),
  },
];

const initialProducts: Product[] = [
  {
    id: 'prod1',
    name: 'Wireless Bluetooth Headphones',
    sku: 'TECH-WBH-001',
    category: 'Electronics',
    quantity: 45,
    minStock: 10,
    price: 79.99,
    businessId: 'biz1',
    businessName: 'TechMart Electronics',
    description: 'Premium wireless headphones with noise cancellation',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-06-15'),
  },
  {
    id: 'prod2',
    name: 'USB-C Charging Cable 2m',
    sku: 'TECH-USB-002',
    category: 'Electronics',
    quantity: 8,
    minStock: 20,
    price: 14.99,
    businessId: 'biz1',
    businessName: 'TechMart Electronics',
    description: 'Fast charging USB-C cable, braided nylon',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-06-20'),
  },
  {
    id: 'prod3',
    name: 'Organic Avocados (Pack of 4)',
    sku: 'GROC-AVO-001',
    category: 'Grocery',
    quantity: 120,
    minStock: 30,
    price: 6.99,
    businessId: 'biz2',
    businessName: 'Fresh Grocers',
    description: 'Fresh organic avocados, ready to eat',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-06-22'),
  },
  {
    id: 'prod4',
    name: 'Whole Grain Bread',
    sku: 'GROC-BRD-002',
    category: 'Grocery',
    quantity: 5,
    minStock: 15,
    price: 4.49,
    businessId: 'biz2',
    businessName: 'Fresh Grocers',
    description: 'Freshly baked whole grain bread',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-06-23'),
  },
  {
    id: 'prod5',
    name: 'Summer Floral Dress',
    sku: 'FASH-DRS-001',
    category: 'Clothing',
    quantity: 25,
    minStock: 8,
    price: 49.99,
    businessId: 'biz3',
    businessName: 'Fashion Forward',
    description: 'Light and breezy summer dress with floral print',
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-06-18'),
  },
  {
    id: 'prod6',
    name: 'Classic Denim Jacket',
    sku: 'FASH-JKT-002',
    category: 'Clothing',
    quantity: 3,
    minStock: 5,
    price: 89.99,
    businessId: 'biz3',
    businessName: 'Fashion Forward',
    description: 'Timeless denim jacket for all seasons',
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-06-21'),
  },
  {
    id: 'prod7',
    name: 'Indoor Plant Pot Set',
    sku: 'HOME-POT-001',
    category: 'Home & Garden',
    quantity: 50,
    minStock: 12,
    price: 24.99,
    businessId: 'biz4',
    businessName: 'Home & Living Co.',
    description: 'Set of 3 ceramic plant pots in various sizes',
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-06-19'),
  },
  {
    id: 'prod8',
    name: 'Garden Tool Set',
    sku: 'HOME-TLS-002',
    category: 'Home & Garden',
    quantity: 2,
    minStock: 8,
    price: 34.99,
    businessId: 'biz4',
    businessName: 'Home & Living Co.',
    description: '5-piece stainless steel garden tool set',
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-06-22'),
  },
];

const initialStockMovements: StockMovement[] = [
  {
    id: 'mov1',
    productId: 'prod1',
    productName: 'Wireless Bluetooth Headphones',
    type: 'in',
    quantity: 20,
    reason: 'New shipment received',
    createdAt: new Date('2024-06-15'),
  },
  {
    id: 'mov2',
    productId: 'prod2',
    productName: 'USB-C Charging Cable 2m',
    type: 'out',
    quantity: 12,
    reason: 'Customer orders',
    createdAt: new Date('2024-06-20'),
  },
  {
    id: 'mov3',
    productId: 'prod4',
    productName: 'Whole Grain Bread',
    type: 'out',
    quantity: 10,
    reason: 'Daily sales',
    createdAt: new Date('2024-06-23'),
  },
];

export const useInventoryStore = create<InventoryState>((set, get) => ({
  products: initialProducts,
  businesses: initialBusinesses,
  stockMovements: initialStockMovements,
  searchQuery: '',
  selectedCategory: 'all',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  addProduct: (product) => set((state) => ({
    products: [...state.products, {
      ...product,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }],
  })),

  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
    ),
  })),

  deleteProduct: (id) => set((state) => ({
    products: state.products.filter((p) => p.id !== id),
  })),

  addBusiness: (business) => set((state) => ({
    businesses: [...state.businesses, {
      ...business,
      id: generateId(),
      productsCount: 0,
      createdAt: new Date(),
    }],
  })),

  updateBusiness: (id, updates) => set((state) => ({
    businesses: state.businesses.map((b) =>
      b.id === id ? { ...b, ...updates } : b
    ),
  })),

  deleteBusiness: (id) => set((state) => ({
    businesses: state.businesses.filter((b) => b.id !== id),
  })),

  addStockMovement: (movement) => set((state) => ({
    stockMovements: [{
      ...movement,
      id: generateId(),
      createdAt: new Date(),
    }, ...state.stockMovements],
  })),

  updateStock: (productId, quantity, type, reason) => {
    const { products, addStockMovement } = get();
    const product = products.find((p) => p.id === productId);
    
    if (product) {
      const newQuantity = type === 'in' 
        ? product.quantity + quantity 
        : Math.max(0, product.quantity - quantity);
      
      set((state) => ({
        products: state.products.map((p) =>
          p.id === productId 
            ? { ...p, quantity: newQuantity, updatedAt: new Date() } 
            : p
        ),
      }));

      addStockMovement({
        productId,
        productName: product.name,
        type,
        quantity,
        reason,
      });
    }
  },
}));
