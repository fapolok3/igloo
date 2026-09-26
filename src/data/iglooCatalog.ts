/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '../types';

export interface IglooCatalogItem {
  id: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  category: string;
  image: string;
  url?: string;
  isOffer?: boolean;
  offerText?: string;
  isPack?: boolean;
}

/**
 * Official products scraped and verified directly from https://igloobd.com/
 * Contains high-definition images, official prices, category, and active offers.
 */
export const IGLOO_OFFICIAL_CATALOG: IglooCatalogItem[] = [
  // --- SPECIAL OFFER PRODUCTS (অফার স্পেশাল প্রোডাক্টসমূহ) ---
  {
    id: 'igloo_ambrosia_5l_offer',
    name: 'Ambrosia 5 Liter (FREE 4 Glass Bowls!)',
    price: 1600,
    oldPrice: 1850,
    category: '5 Liter Celebration',
    image: 'https://igloobd.com/product_images/thumbnail/1601267516.png',
    url: 'https://igloobd.com/product-details/5-liters-ambrosia-ice-cream-30-pieces-cone-biscuits-free',
    isOffer: true,
    offerText: '🎁 FREE 4 Glass Bowls!',
    isPack: true,
  },
  {
    id: 'igloo_black_forest_5l_offer',
    name: 'Black Forest 5 Liter (FREE 4 Glass Bowls!)',
    price: 1600,
    oldPrice: 1850,
    category: '5 Liter Celebration',
    image: 'https://igloobd.com/product_images/thumbnail/1604400623.jpg',
    url: 'https://igloobd.com/product-details/5-liters-black-forest-ice-cream-30-pieces-cone-biscuits-free',
    isOffer: true,
    offerText: '🎁 FREE 4 Glass Bowls!',
    isPack: true,
  },
  {
    id: 'igloo_butterscotch_5l_offer',
    name: 'Butterscotch 5 Liter (FREE 4 Glass Bowls!)',
    price: 1600,
    oldPrice: 1850,
    category: '5 Liter Celebration',
    image: 'https://igloobd.com/product_images/thumbnail/1601547064.png',
    url: 'https://igloobd.com/product-details/5-liters-butter-scotch-ice-cream-30-pieces-cone-biscuits-free',
    isOffer: true,
    offerText: '🎁 FREE 4 Glass Bowls!',
    isPack: true,
  },
  {
    id: 'igloo_cream_cookies_1l_offer',
    name: 'Cream & Cookies 1 Liter (FREE 2 Glass Bowls!)',
    price: 1050,
    oldPrice: 1200,
    category: 'Premium Tub',
    image: 'https://igloobd.com/product_images/thumbnail/1782120244.jpg',
    url: 'https://igloobd.com/product-details/cream-cookies',
    isOffer: true,
    offerText: '🎁 FREE 2 Glass Bowls!',
    isPack: false,
  },
  {
    id: 'igloo_cream_cookies_2box_offer',
    name: 'Cream & Cookies 2 Boxes (4 Glass Bowls Free!!)',
    price: 1999,
    oldPrice: 2300,
    category: 'Special Combo',
    image: 'https://igloobd.com/product_images/thumbnail/1785843603.png',
    url: 'https://igloobd.com/product-details/cream-cookies-2-boxs-18-pcs-cone-biscuits-free',
    isOffer: true,
    offerText: '🎁 4 Glass Bowls Free!!',
    isPack: true,
  },
  {
    id: 'igloo_mango_layers_fusion_combo_offer',
    name: 'Mango Layers, Mango Fusion & Zero Vanilla Combo',
    price: 1030,
    oldPrice: 1280,
    category: 'Special Combo',
    image: 'https://igloobd.com/product_images/thumbnail/1789881140.png',
    url: 'https://igloobd.com/product-details/mango-layers-mango-fusion-zero-vanilla-combo',
    isOffer: true,
    offerText: '🔥 Combo Deal (Save ৳250)',
    isPack: true,
  },

  // --- 1 LITER & 2 LITER TUBS ---
  {
    id: 'igloo_ambrosia_1l',
    name: 'Ambrosia 1 Liter',
    price: 400,
    category: '1 Liter Tub',
    image: 'https://igloobd.com/product_images/thumbnail/1632721232.png',
    url: 'https://igloobd.com/product-details/ambrosia-1-liter',
  },
  {
    id: 'igloo_chocolate_1l',
    name: 'Chocolate 1 Liter',
    price: 300,
    category: '1 Liter Tub',
    image: 'https://igloobd.com/product_images/thumbnail/1656736867.png',
    url: 'https://igloobd.com/product-details/chocolate',
  },
  {
    id: 'igloo_vanilla_1l',
    name: 'Vanilla 1 Liter',
    price: 300,
    category: '1 Liter Tub',
    image: 'https://igloobd.com/product_images/thumbnail/1656736811.png',
    url: 'https://igloobd.com/product-details/vanilla',
  },
  {
    id: 'igloo_mango_1l',
    name: 'Mango 1 Liter',
    price: 300,
    category: '1 Liter Tub',
    image: 'https://igloobd.com/product_images/thumbnail/1656736915.png',
    url: 'https://igloobd.com/product-details/mango',
  },
  {
    id: 'igloo_mango_melody_1l',
    name: 'Mango Melody',
    price: 350,
    category: '1 Liter Tub',
    image: 'https://igloobd.com/product_images/1581594232.jpg',
    url: 'https://igloobd.com/product-details/mango-melody',
  },
  {
    id: 'igloo_kheer_malai_tub',
    name: 'Kheer Malai Tub',
    price: 400,
    category: '1 Liter Tub',
    image: 'https://igloobd.com/product_images/1595431087.jpg',
    url: 'https://igloobd.com/product-details/kheer-malai',
  },
  {
    id: 'igloo_french_vanilla',
    name: 'French Vanilla Premium Tub',
    price: 795,
    category: 'Premium Tub',
    image: 'https://igloobd.com/product_images/1584292623.png',
    url: 'https://igloobd.com/product-details/french-vanilla',
  },
  {
    id: 'igloo_chocolate_2l',
    name: 'Chocolate 2 Liter',
    price: 580,
    category: '2 Liter Tub',
    image: 'https://igloobd.com/product_images/1595951594.jpg',
    url: 'https://igloobd.com/product-details/chocolate-1',
  },
  {
    id: 'igloo_mango_2l',
    name: 'Mango 2 Liter',
    price: 580,
    category: '2 Liter Tub',
    image: 'https://igloobd.com/product_images/1595951562.jpg',
    url: 'https://igloobd.com/product-details/mango-1',
  },
  {
    id: 'igloo_vanilla_2l',
    name: 'Vanilla 2 Liter',
    price: 580,
    category: '2 Liter Tub',
    image: 'https://igloobd.com/product_images/1595951813.jpg',
    url: 'https://igloobd.com/product-details/vanilla',
  },

  // --- MULTI-BOX COMBOS ---
  {
    id: 'igloo_zero_vanilla_2box',
    name: 'Zero Vanilla 500ml 2 boxes',
    price: 500,
    category: 'Multi-Box Combo',
    image: 'https://igloobd.com/product_images/thumbnail/1788001745.png',
    url: 'https://igloobd.com/product-details/zero-vanilla-500ml-2-boxes',
    isPack: true,
  },
  {
    id: 'igloo_mango_layers_2box',
    name: 'Mango Layers 2 boxes',
    price: 780,
    category: 'Multi-Box Combo',
    image: 'https://igloobd.com/product_images/thumbnail/1789799415.jpeg',
    url: 'https://igloobd.com/product-details/mango-layers',
    isPack: true,
  },
  {
    id: 'igloo_mango_fusion_2box',
    name: 'Mango Fusion 2 boxes',
    price: 780,
    category: 'Multi-Box Combo',
    image: 'https://igloobd.com/product_images/thumbnail/1789801621.jpeg',
    url: 'https://igloobd.com/product-details/mango-fusion',
    isPack: true,
  },

  // --- CONES ---
  {
    id: 'igloo_cornelli_belgian_14',
    name: 'Cornelli Belgian Chocolate Cone (14 pcs)',
    price: 980,
    category: 'Cone Pack',
    image: 'https://igloobd.com/product_images/thumbnail/1601268455.png',
    url: 'https://igloobd.com/product-details/belgian-chocolate-cone-14-pcs',
    isPack: true,
  },
  {
    id: 'igloo_cornelli_classic_14',
    name: 'Cornelli Classic Cone (14 pcs)',
    price: 840,
    category: 'Cone Pack',
    image: 'https://igloobd.com/product_images/1581584383.jpg',
    url: 'https://igloobd.com/product-details/cornelli-classic-cone-14-pcs',
    isPack: true,
  },

  // --- STICK & ICE LOLLY PACKS ---
  {
    id: 'igloo_chocbar_24',
    name: 'Chocbar (24 pcs)',
    price: 840,
    category: 'Stick Pack',
    image: 'https://igloobd.com/product_images/thumbnail/1658727399.jpg',
    url: 'https://igloobd.com/product-details/chocbar',
    isPack: true,
  },
  {
    id: 'igloo_chocbar_insta_24',
    name: 'Chocbar Insta (24 pcs)',
    price: 720,
    category: 'Stick Pack',
    image: 'https://igloobd.com/product_images/thumbnail/1581583646.png',
    url: 'https://igloobd.com/product-details/chocbar-insta-24-pcs',
    isPack: true,
  },
  {
    id: 'igloo_mega_16',
    name: 'Mega (16 pcs)',
    price: 960,
    category: 'Stick Pack',
    image: 'https://igloobd.com/product_images/1594667750.jpg',
    url: 'https://igloobd.com/product-details/mega-16-pcs',
    isPack: true,
  },
  {
    id: 'igloo_dudh_malai_25',
    name: 'Dudh Malai (25 pcs)',
    price: 625,
    category: 'Stick Pack',
    image: 'https://igloobd.com/product_images/thumbnail/1633948687.png',
    url: 'https://igloobd.com/product-details/dudh-malai-25-pcs',
    isPack: true,
  },
  {
    id: 'igloo_shell_core_25',
    name: 'Shell & Core (25 pcs)',
    price: 750,
    category: 'Stick Pack',
    image: 'https://igloobd.com/product_images/1594667830.jpg',
    url: 'https://igloobd.com/product-details/shell-core-25-pcs',
    isPack: true,
  },
  {
    id: 'igloo_kheer_malai_12',
    name: 'Kheer Malai (12pcs)',
    price: 840,
    category: 'Stick Pack',
    image: 'https://igloobd.com/product_images/thumbnail/1683779272.jpg',
    url: 'https://igloobd.com/product-details/kheer-malai-12pcs',
    isPack: true,
  },
  {
    id: 'igloo_black_forest_12',
    name: 'BLACK FOREST (12 pcs)',
    price: 840,
    category: 'Stick Pack',
    image: 'https://igloobd.com/product_images/1581583848.jpg',
    url: 'https://igloobd.com/product-details/blackforest-12-pcs',
    isPack: true,
  },
  {
    id: 'igloo_lolly_orange_25',
    name: 'Lolly- Orange (25 pcs)',
    price: 500,
    category: 'Ice Lolly Pack',
    image: 'https://igloobd.com/product_images/thumbnail/1756755724.png',
    url: 'https://igloobd.com/product-details/lolly-orange-25-pcs',
    isPack: true,
  },
  {
    id: 'igloo_lolly_lemon_25',
    name: 'Lolly- Lemon (25 pcs)',
    price: 500,
    category: 'Ice Lolly Pack',
    image: 'https://igloobd.com/product_images/thumbnail/1717308019.png',
    url: 'https://igloobd.com/product-details/lolly-lemon-25-pcs',
    isPack: true,
  },

  // --- CUPS ---
  {
    id: 'igloo_vanilla_cup_18',
    name: 'Vanilla cup (18 pcs)',
    price: 540,
    category: 'Cup Pack',
    image: 'https://igloobd.com/product_images/thumbnail/1653116634.png',
    url: 'https://igloobd.com/product-details/vanilla-cup-18-pcs',
    isPack: true,
  },
];

/**
 * Converts catalog items to application Product format with complete image and offer metadata
 */
export function getIglooProductsAsAppProducts(): Product[] {
  return IGLOO_OFFICIAL_CATALOG.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    image: item.image,
    category: item.category,
    url: item.url,
    oldPrice: item.oldPrice,
    isOffer: item.isOffer,
    offerText: item.offerText,
  }));
}
