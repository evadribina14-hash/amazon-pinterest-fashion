const state={
  page:'home',
  query:"women's fall outfits",
  products:[],
  pins:[],
  schedule:{},
  detail:null
};

const boards=[
  'Classy Minimal Outfits',
  'Chic Everyday Outfit Ideas',
  'Capsule wardrobe outfit ideas',
  'Women’s Outfit Ideas'
];

const categories=[
  'dresses',
  'tops',
  'blouses',
  'shirts',
  'sweaters',
  'cardigans',
  'jackets',
  'blazers',
  'puffer jackets',
  'coats',
  'trench coats',
  'jumpsuits',
  'rompers',
  'two piece sets',
  'loungewear'
];

const blocked=[
  'jeans',
  'pants',
  'trousers',
  'leggings',
  'skirt',
  'activewear',
  'sportswear',
  'workout',
  'swimsuit',
  'bikini',
  'swimwear',
  'shoes',
  'boots',
  'sneakers',
  'sandals',
  'handbag',
  'purse',
  'backpack',
  'jewelry',
  'necklace',
  'earrings',
  'bracelet',
  'watch',
  'belt',
  'scarf',
  'hat'
];

const demo=[
  {
    asin:'DEMO-DRESS-01',
    title:'Women’s Casual Denim Shirt Dress',
    price:'$49.99',
    category:'dresses',
    images:[
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e
