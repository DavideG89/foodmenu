export type Category = {
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  promoPrice?: number;
  image: string;
  categorySlug: string;
  badges?: string[];
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  highlight?: string;
};

export type RestaurantInfo = {
  address: string;
  phone: string;
  email: string;
  hours: { day: string; open: string; close: string }[];
  mapsUrl: string;
};

export const categories: Category[] = [
  { name: 'Burgers', slug: 'burgers' },
  { name: 'Fries', slug: 'fries' },
  { name: 'Drinks', slug: 'drinks' },
  { name: 'Sides', slug: 'sides' },
  { name: 'Specials', slug: 'specials' }
];

export const products: Product[] = [
  {
    id: 'burger-01',
    name: 'Classic Smash Burger',
    description: 'Manzo 150g, cheddar fuso, cipolle caramellate e salsa della casa in bun artigianale.',
    price: 10.5,
    promoPrice: 8.5,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b',
    categorySlug: 'burgers',
    badges: ['-20%']
  },
  {
    id: 'burger-02',
    name: 'Truffle Burger',
    description: 'Burger gourmet con crema al tartufo, provola affumicata e funghi porcini.',
    price: 13.9,
    image: 'https://images.unsplash.com/photo-1606755962773-0e7d9442b8ba',
    categorySlug: 'burgers',
    badges: ['Novità']
  },
  {
    id: 'fries-01',
    name: 'Patate Rustiche',
    description: 'Patate taglio rustico doppia cottura con sale alle erbe.',
    price: 4.5,
    image: 'https://images.unsplash.com/photo-1542838686-73e7d57c09b0',
    categorySlug: 'fries'
  },
  {
    id: 'fries-02',
    name: 'Loaded Fries',
    description: 'Con cheddar, bacon croccante e salsa ranch.',
    price: 6.5,
    image: 'https://images.unsplash.com/photo-1528834342814-5a7a67d87c5a',
    categorySlug: 'fries',
    badges: ['Best seller']
  },
  {
    id: 'drink-01',
    name: 'Limonata Artigianale',
    description: 'Fresca limonata con limoni di Sorrento e menta.',
    price: 3.8,
    image: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d',
    categorySlug: 'drinks'
  },
  {
    id: 'drink-02',
    name: 'Cold Brew',
    description: 'Estratto a freddo, servito con ghiaccio e scorza di arancia.',
    price: 3.5,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348',
    categorySlug: 'drinks'
  },
  {
    id: 'side-01',
    name: 'Coleslaw',
    description: 'Insalata di cavolo croccante, carote e salsa yogurt.',
    price: 3.2,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    categorySlug: 'sides'
  },
  {
    id: 'side-02',
    name: 'Chicken Bites',
    description: 'Bocconcini di pollo impanati con salsa piccante.',
    price: 6.9,
    promoPrice: 5.5,
    image: 'https://images.unsplash.com/photo-1608032362237-02f7c8b3baed',
    categorySlug: 'sides',
    badges: ['-20%']
  },
  {
    id: 'special-01',
    name: 'Chef Special Combo',
    description: 'Burger deluxe + loaded fries + drink artigianale.',
    price: 18.9,
    promoPrice: 16.0,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90',
    categorySlug: 'specials',
    badges: ['Combo']
  }
];

export const offers: Offer[] = [
  {
    id: 'offer-01',
    title: 'Promo pranzo',
    description: 'Dal lunedì al venerdì 12:00-15:00',
    highlight: 'Sconto 20% sui burger classici'
  }
];

export const restaurantInfo: RestaurantInfo = {
  address: 'Via Roma 42, 80100 Napoli',
  phone: '+39 081 123 4567',
  email: 'ciao@greenburger.it',
  mapsUrl: 'https://maps.google.com/?q=Via+Roma+42,+Napoli',
  hours: [
    { day: 'Lunedì', open: '11:30', close: '22:30' },
    { day: 'Martedì', open: '11:30', close: '22:30' },
    { day: 'Mercoledì', open: '11:30', close: '22:30' },
    { day: 'Giovedì', open: '11:30', close: '22:30' },
    { day: 'Venerdì', open: '11:30', close: '23:30' },
    { day: 'Sabato', open: '11:00', close: '23:30' },
    { day: 'Domenica', open: '11:00', close: '22:00' }
  ]
};
