/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FAQItem {
  id: string;
  category: 'general' | 'comments' | 'mango_layers' | 'mango_fusion' | 'zero' | 'escalation' | string;
  categoryLabel: string;
  topic: string;
  question?: string;
  englishReply: string;
  banglaReply: string;
  tags: string[];
  isCustom?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PriceListItem {
  id: string;
  category: string;
  product: string;
  volume: number;
  unit: string;
  pricePerPcs: number;
  pricePerCarton: number;
}

export const SUPPORT_RULES = [
  'Always answer using the approved Knowledge Base. Never invent prices, offers, delivery info, or policy.',
  'Understand Bangla, English, and Banglish customer inputs accurately.',
  'Match the customer’s language in your reply (Bangla input -> Bangla reply, English -> English, mixed -> Bangla).',
  'If the exact question isn’t in the Knowledge Base, don’t guess — ask a short clarifying question, or say a human agent will assist (Escalation).',
  'Give polite reply options closer to approved script, never changing facts (price, availability, delivery area, policy).',
  'Never promise a refund, replacement, discount, or compensation unless explicitly in the Knowledge Base.',
  'Keep the Igloo tone: polite, warm, "Dear Valued Customer / প্রিয় গ্রাহক" opening, thank-you closing.'
];

export const KNOWLEDGE_BASE_ITEMS: FAQItem[] = [
  // --- 1. General Customer Message FAQs ---
  {
    id: 'gen_out_of_stock',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'Out of stock',
    question: 'প্রোডাক্ট কি স্টকে আছে? / Is this product in stock?',
    englishReply: `We sincerely apologize, but this product is currently out of stock. We hope it will be available again very soon. Please stay tuned for updates. Thank you for your interest and patience.`,
    banglaReply: `দুঃখিত, প্রোডাক্টটি এই মুহূর্তে স্টক আউট রয়েছে। আমরা আশা করছি খুব শীঘ্রই এটি আবার স্টকে উপলব্ধ হবে। আপডেটের জন্য আমাদের সাথেই থাকুন। আপনার আগ্রহের জন্য আন্তরিক ধন্যবাদ।`,
    tags: ['stock', 'out of stock', 'স্টক আউট', 'নাই', 'available']
  },
  {
    id: 'gen_cone_biscuits_sale',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'CONE biscuits SALE',
    question: 'কোন বিস্কুট কি আলাদাভাবে কিনতে পাওয়া যাবে? / Can I buy cone biscuits separately?',
    englishReply: `Dear Valued Customer,

Thank you for your interest. We apologize, but cone biscuits are not available for separate purchase. They are only provided with selected promotional offers.

Thank you for your understanding.`,
    banglaReply: `প্রিয় গ্রাহক,

দুঃখিত, কোন বিস্কুট আলাদাভাবে বিক্রি করা হয় না। এটি শুধুমাত্র নির্দিষ্ট অফারের সাথে দেওয়া হয়।

ধন্যবাদ।`,
    tags: ['cone', 'biscuit', 'বিস্কুট', 'কোন বিস্কুট', 'separate purchase']
  },
  {
    id: 'gen_out_of_zone',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'OUT of zone',
    question: 'আমার এলাকায় কি ডেলিভারি দেন? (ঢাকার বাইরে) / Do you deliver to my area outside Dhaka?',
    englishReply: `Dear Valued Customer,

Thank you for your interest. We apologize, but our home delivery service is currently available only within Dhaka Metropolitan City.

However, Igloo products may be available at nearby retail stores and supermarkets. We recommend checking with your local outlets for availability.

Thank you for your understanding.`,
    banglaReply: `প্রিয় গ্রাহক,

আপনার আগ্রহের জন্য ধন্যবাদ। দুঃখিত, বর্তমানে আমাদের হোম ডেলিভারি সার্ভিস শুধুমাত্র ঢাকা মেট্রোপলিটন এলাকার মধ্যে সীমাবদ্ধ।

তবে আপনার নিকটস্থ দোকান বা সুপারশপে Igloo পণ্য পাওয়া যেতে পারে।

ধন্যবাদ।`,
    tags: ['out of zone', 'outside dhaka', 'ঢাকার বাইরে', 'ডেলিভারি এরিয়া', 'zone']
  },
  {
    id: 'gen_place_order',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'How can I place an order?',
    question: 'কীভাবে অর্ডার করবো? / How can I order?',
    englishReply: `Dear Valued Customer,

Thank you for your interest in Igloo.

To place your order, please visit our website:
https://igloobd.com/

Or call us at 16556 between 9:00 AM and 6:00 PM.
Igloo provides free home delivery service within Dhaka Metropolitan City only.
Thank you for choosing Igloo.`,
    banglaReply: `প্রিয় গ্রাহক,

ইগলুর প্রতি আপনার আগ্রহের জন্য ধন্যবাদ।

অর্ডার করতে অনুগ্রহ করে আমাদের ওয়েবসাইটে ভিজিট করুন:
https://igloobd.com/

অথবা আপনি চাইলে সকাল ৯:০০টা থেকে সন্ধ্যা ৬:০০টা পর্যন্ত ১৬৫৫৬ নম্বরে কল করেও অর্ডার করতে পারবেন।

ইগলুর ফ্রি হোম ডেলিভারি সার্ভিস বর্তমানে শুধুমাত্র ঢাকা মেট্রোপলিটন এলাকার মধ্যে উপলব্ধ।

ইগলুর সাথে থাকার জন্য আপনাকে ধন্যবাদ।`,
    tags: ['order', 'how to order', 'অর্ডার', 'কিভাবে অর্ডার', 'website', '16556']
  },
  {
    id: 'gen_area_availability',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'Is home delivery available in my area?',
    question: 'আমার এলাকায় কি হোম ডেলিভারি পাওয়া যাবে?',
    englishReply: `Dear Valued Customer,

Thank you for your interest.

Kindly share your location (Area/City), and we will check whether home delivery is available in your area and let you know accordingly.
Thank you.`,
    banglaReply: `প্রিয় গ্রাহক,

ইগলুর প্রতি আপনার আগ্রহের জন্য ধন্যবাদ।

অনুগ্রহ করে আপনার এলাকার নাম (এলাকা/শহর) আমাদের জানান। আমরা যাচাই করে জানাবো, আপনার এলাকায় হোম ডেলিভারি সেবা উপলব্ধ রয়েছে কি না।
ধন্যবাদ।`,
    tags: ['area', 'location', 'homedelivery', 'এলাকা', 'লোকেশন']
  },
  {
    id: 'gen_outside_dhaka',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'Do you deliver outside Dhaka?',
    question: 'আপনারা কি ঢাকার বাইরে ডেলিভারি দেন?',
    englishReply: `Dear Valued Customer,

Thank you for your interest.

We sincerely apologize, but our home delivery service is currently available only within Dhaka Metropolitan City.

However, Igloo products may be available at your nearest retail stores or supermarkets.
Thank you for your understanding.`,
    banglaReply: `প্রিয় গ্রাহক,

ইগলুর প্রতি আপনার আগ্রহের জন্য ধন্যবাদ।

আন্তরিকভাবে দুঃখিত, বর্তমানে আমাদের হোম ডেলিভারি সার্ভিস শুধুমাত্র ঢাকা মেট্রোপলিটন এলাকার মধ্যে উপলব্ধ।

তবে আপনার নিকটস্থ দোকান বা সুপারশপে Igloo-এর পণ্য পাওয়া যেতে পারে। ধন্যবাদ।`,
    tags: ['outside dhaka', 'ঢাকার বাইরে', 'district', 'জেলা']
  },
  {
    id: 'gen_delivery_time',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'When will I receive my order?',
    question: 'অর্ডার কখন পাবো? / When will I get delivery?',
    englishReply: `Dear Valued Customer,

Thank you for your order.

We always try to deliver orders on the same day they are placed. However, if same-day delivery is not possible due to operational reasons, your order will usually be delivered within the next 2 days.
We appreciate your patience and understanding.`,
    banglaReply: `প্রিয় গ্রাহক,

আপনার অর্ডারের জন্য ধন্যবাদ।

আমরা সর্বদা চেষ্টা করি অর্ডারটি যেদিন করা হয়, সেদিনই ডেলিভারি সম্পন্ন করতে। তবে কোনো অপারেশনাল বা অনিবার্য কারণে একই দিনে ডেলিভারি সম্ভব না হলে, সাধারণত পরবর্তী ২ দিনের মধ্যে আপনার অর্ডারটি ডেলিভারি করা হয়।
আপনার ধৈর্য ও সহযোগিতার জন্য আন্তরিক ধন্যবাদ।`,
    tags: ['delivery time', 'when delivery', 'কখন পাবো', 'সময়', 'ডেলিভারি সময়']
  },
  {
    id: 'gen_order_delay',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: "I haven't received my order yet.",
    question: 'অর্ডার এখনো পাইনি / Haven’t received order yet',
    englishReply: `Dear Valued Customer,

We sincerely apologize for the delay.

Kindly share your Order ID so that we can check the status of your order and update you accordingly.
Thank you.`,
    banglaReply: `প্রিয় গ্রাহক,

আপনার অসুবিধার জন্য আন্তরিকভাবে দুঃখিত।

অনুগ্রহ করে আপনার Order ID আমাদের সাথে শেয়ার করুন। আমরা আপনার অর্ডারের বর্তমান অবস্থা যাচাই করে যত দ্রুত সম্ভব আপনাকে জানাব।

ধন্যবাদ।`,
    tags: ['not received', 'delay', 'order id', 'অর্ডার পাইনি', 'দেরি']
  },
  {
    id: 'gen_avail_yes',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'Is this product available? YES',
    question: 'পণ্যটি কি এভেইলেবল আছে? (হ্যাঁ থাকলে)',
    englishReply: `Dear Valued Customer,

Yes, this product is currently available.

You may place your order at your convenience.
Thank you.`,
    banglaReply: `প্রিয় গ্রাহক,

ইগলুর প্রতি আপনার আগ্রহের জন্য ধন্যবাদ।

জি, পণ্যটি বর্তমানে উপলব্ধ রয়েছে।

অর্ডার করতে অনুগ্রহ করে আমাদের ওয়েবসাইট ব্যবহার করুন অথবা সকাল ৯:০০টা থেকে সন্ধ্যা ৬:০০টা পর্যন্ত ১৬৫৫৬ নম্বরে যোগাযোগ করুন।
ধন্যবাদ।`,
    tags: ['available yes', 'উপলব্ধ', 'স্টকে আছে', 'available']
  },
  {
    id: 'gen_avail_no',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'Is this product available? NO',
    question: 'পণ্যটি কি এভেইলেবল আছে? (না থাকলে)',
    englishReply: `Dear Valued Customer,

We sincerely apologize, but this product is currently unavailable.

Thank you for your understanding.`,
    banglaReply: `প্রিয় গ্রাহক,

ইগলুর প্রতি আপনার আগ্রহের জন্য ধন্যবাদ।

আন্তরিকভাবে দুঃখিত, পণ্যটি বর্তমানে স্টকে নেই। পণ্যটি পুনরায় উপলব্ধ হলে আমাদের অফিসিয়াল পেজে জানানো হবে।
আপনার ধৈর্য ও বোঝাপড়ার জন্য ধন্যবাদ।`,
    tags: ['unavailable', 'নেই', 'স্টকে নেই', 'available no']
  },
  {
    id: 'gen_facebook_order',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'Facebook-এ অর্ডার',
    question: 'ফেসবুকে কি অর্ডার নেওয়া হয়?',
    englishReply: `Dear Valued Customer,

Thank you for your interest.

We sincerely apologize, but we do not accept orders through Facebook.

Kindly place your order through our website:
https://igloobd.com/

Or call us at 16556 (9:00 AM – 6:00 PM).
Thank you for choosing Igloo.`,
    banglaReply: `প্রিয় গ্রাহক,

ইগলুর প্রতি আপনার আগ্রহের জন্য ধন্যবাদ।

আন্তরিকভাবে দুঃখিত, বর্তমানে ফেসবুকের মাধ্যমে অর্ডার গ্রহণ করা হয় না।

অর্ডার করতে অনুগ্রহ করে আমাদের ওয়েবসাইটে ভিজিট করুন:
https://igloobd.com/

এছাড়াও, অর্ডার করতে অথবা এ-সংক্রান্ত যেকোনো সহায়তার জন্য সকাল ৯:০০টা থেকে সন্ধ্যা ৬:০০টা পর্যন্ত ১৬৫৫৬ নম্বরে যোগাযোগ করুন।
ইগলুর সাথে থাকার জন্য ধন্যবাদ।`,
    tags: ['facebook order', 'ইনবক্সে অর্ডার', 'fb order', 'ফেসবুকে অর্ডার']
  },
  {
    id: 'gen_offer_no_all',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'Is there any offer available now? NO',
    question: 'বর্তমানে কি কোনো অফার চলছে? (সাধারণভাবে)',
    englishReply: `Dear Valued Customer,

Thank you for your interest.

We sincerely apologize, but there are currently no ongoing offers or promotions on our products.
Please stay connected with our official Facebook page for updates on future offers and promotions.
Thank you.`,
    banglaReply: `প্রিয় গ্রাহক,

আপনার আগ্রহের জন্য ধন্যবাদ।

আন্তরিকভাবে দুঃখিত, বর্তমানে আমাদের কোনো প্রোডাক্টে অফার চলছে না।
নতুন অফার ও প্রচারণার আপডেট পেতে অনুগ্রহ করে আমাদের অফিসিয়াল ফেসবুক পেজের সাথেই থাকুন।
ধন্যবাদ।`,
    tags: ['offer no', 'অফার নেই', 'offers general']
  },
  {
    id: 'gen_offer_no_product',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'এই প্রোডাক্টে কি কোনো অফার আছে? NO',
    question: 'নির্দিষ্ট পণ্যে অফার আছে কি না? (না থাকলে)',
    englishReply: `Dear Valued Customer,

Thank you for your interest.

We sincerely apologize, but there is currently no offer available on this product.
Please stay connected with Igloo for future offers and promotions.
Thank you.`,
    banglaReply: `প্রিয় গ্রাহক,

ইগলুর প্রতি আপনার আগ্রহের জন্য ধন্যবাদ।

দুঃখিত, বর্তমানে এই পণ্যে কোনো অফার চলছে না।

ভবিষ্যতের অফার ও প্রোমোশন সম্পর্কে জানতে ইগলুর সাথেই থাকুন।

ধন্যবাদ।`,
    tags: ['product offer no', 'অফার নেই', 'no discount']
  },
  {
    id: 'gen_offer_yes_product',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'এই প্রোডাক্টে কি কোনো অফার আছে? YES',
    question: 'নির্দিষ্ট পণ্যে অফার আছে কি না? (হ্যাঁ থাকলে)',
    englishReply: `Dear Valued Customer,

Thank you for your interest.

Yes, this product is currently available with a special offer.

Kindly place your order through our website or call 16556 (9:00 AM – 6:00 PM) to enjoy the offer.

Thank you for choosing Igloo.`,
    banglaReply: `প্রিয় গ্রাহক,

ইগলুর প্রতি আপনার আগ্রহের জন্য ধন্যবাদ।

জি, বর্তমানে এই পণ্যে একটি বিশেষ অফার চলছে।

অর্ডার করতে আমাদের ওয়েবসাইট ভিজিট করুন অথবা সকাল ৯:০০টা থেকে সন্ধ্যা ৬:০০টা পর্যন্ত ১৬৫৫৬ নম্বরে কল করুন।

ইগলুর সঙ্গে থাকার জন্য ধন্যবাদ।`,
    tags: ['product offer yes', 'অফার আছে', 'special offer']
  },
  {
    id: 'gen_coupon',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'coupon',
    question: 'প্রথম অর্ডারে কুপন বা ডিসকাউন্ট কোড আছে কি? / Any coupon code?',
    englishReply: `Dear Sir/Ma'am,

We apologize, but there is currently no coupon or special discount available for first-time orders.

Thank you for your interest and understanding.`,
    banglaReply: `দুঃখিত স্যার/ম্যাম, বর্তমানে প্রথম অর্ডারের জন্য কোনো কুপন বা বিশেষ ডিসকাউন্ট অফার নেই। নতুন কোনো অফার বা প্রোমোশন এলে আমাদের পেজে জানানো হবে। ধন্যবাদ।`,
    tags: ['coupon', 'discount', 'কুপন', 'ডিসকাউন্ট', 'promo']
  },
  {
    id: 'gen_dealership_interest',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'I want dealership.',
    question: 'ইগলুর ডিলারশিপ নিতে চাই / I want dealership',
    englishReply: `Dear Valued Customer,

Thank you for your interest in becoming an Igloo dealer.

Kindly share your location, and we will guide you further regarding dealership opportunities.
Thank you.`,
    banglaReply: `প্রিয় গ্রাহক,

ইগলু ডিলার হওয়ার আগ্রহ প্রকাশ করার জন্য আপনাকে ধন্যবাদ।

অনুগ্রহ করে আপনার এলাকার নাম (জেলা/শহর) আমাদের জানান। আমরা আপনার লোকেশন অনুযায়ী প্রয়োজনীয় তথ্য ও পরবর্তী করণীয় সম্পর্কে আপনাকে জানাব।
ধন্যবাদ।`,
    tags: ['dealership', 'dealer', 'ডিলার', 'ডিলারশিপ']
  },
  {
    id: 'gen_dealership_rsm',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'Dealership (RSM Contact)',
    question: 'ডিলারশিপের জন্য কার সাথে যোগাযোগ করবো?',
    englishReply: `Dear Valued Customer,

Thank you for your interest.

For further assistance, we kindly request you to contact our Regional Sales Manager for your area using the details below:

Name:
Contact:

Thank you for choosing Igloo.`,
    banglaReply: `প্রিয় গ্রাহক,

ইগলুর প্রতি আপনার আগ্রহের জন্য ধন্যবাদ।

এ বিষয়ে বিস্তারিত সহায়তার জন্য অনুগ্রহ করে আপনার এলাকার Regional Sales Manager (RSM)-এর সঙ্গে নিচের তথ্য অনুযায়ী যোগাযোগ করুন।

নাম:
মোবাইল:

ইগলুর সাথে থাকার জন্য আপনাকে ধন্যবাদ।`,
    tags: ['rsm', 'dealership contact', 'সেলস ম্যানেজার']
  },
  {
    id: 'gen_dealership_num_off',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'Dealership/number off/not received',
    question: 'ডিলারশিপের নাম্বারে কল ঢুকছে না / বন্ধ বলছে',
    englishReply: `Dear Valued Customer,

We sincerely apologize for the inconvenience.

Kindly try contacting the number again after some time. If you are still unable to reach them, please let us know. We will be happy to provide you with an alternative contact number.
Thank you.`,
    banglaReply: `প্রিয় গ্রাহক,

অসুবিধার জন্য আমরা আন্তরিকভাবে দুঃখিত।

অনুগ্রহ করে কিছুক্ষণ পর পুনরায় যোগাযোগ করার চেষ্টা করুন। যদি তখনও যোগাযোগ করতে সমস্যা হয়, তাহলে আমাদের জানান। আমরা বিকল্প যোগাযোগের তথ্য দিয়ে আপনাকে সহায়তা করব।
ধন্যবাদ।`,
    tags: ['number off', 'not received', 'কল ঢুকছে না', 'বিকল্প নম্বর']
  },
  {
    id: 'gen_complaint_staff',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'Complaint about staff/service.',
    question: 'স্টাফ বা সার্ভিস নিয়ে অভিযোগ / Complaint about staff/service',
    englishReply: `Dear Valued Customer,

We sincerely apologize for the inconvenience and for the experience you had. We truly regret that we were unable to meet your expectations.

Thank you for bringing this matter to our attention. Your feedback is very important to us, and we will share it with the concerned team for review and necessary action to help improve our service.
We sincerely appreciate your patience, understanding, and continued support.`,
    banglaReply: `প্রিয় গ্রাহক,

আপনার অসন্তোষজনক অভিজ্ঞতার জন্য আমরা আন্তরিকভাবে দুঃখিত। আমরা বুঝতে পারছি যে এই বিষয়টি আপনার জন্য হতাশাজনক ছিল, এবং আপনার প্রত্যাশা পূরণ করতে না পারায় আমরা আন্তরিকভাবে ক্ষমাপ্রার্থী।

বিষয়টি আমাদের নজরে আনার জন্য আপনাকে ধন্যবাদ। আপনার মতামত আমাদের কাছে অত্যন্ত মূল্যবান। আমরা আপনার অভিযোগটি সংশ্লিষ্ট টিমের কাছে পর্যালোচনা ও প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য পাঠিয়ে দেব, যাতে ভবিষ্যতে আরও উন্নত সেবা নিশ্চিত করা যায়।

আপনার ধৈর্য এবং ইগলুর প্রতি আস্থার জন্য আন্তরিক ধন্যবাদ।`,
    tags: ['complaint', 'bad service', 'অভিযোগ', 'খারাপ ব্যবহার', 'staff']
  },
  {
    id: 'gen_thank_you_parcel',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'Thank you / Got my parcel',
    question: 'অর্ডার পেয়েছি, ধন্যবাদ / Received my ice cream',
    englishReply: `Dear Valued Customer,

We're delighted to know that you have received your order.

We hope you enjoy your Igloo ice cream. Thank you for choosing Igloo, and we look forward to serving you again.`,
    banglaReply: `প্রিয় গ্রাহক,

আপনি আপনার অর্ডারটি পেয়েছেন জেনে আমরা আনন্দিত।

আশা করি, ইগলুর আইসক্রিম আপনার প্রত্যাশা পূরণ করবে। আপনার ভালোবাসা ও আস্থার জন্য আন্তরিক ধন্যবাদ। ভবিষ্যতেও আপনাকে সেবা দেওয়ার সুযোগ পেলে আমরা আনন্দিত হব।
ধন্যবাদ।`,
    tags: ['thank you', 'got parcel', 'ধন্যবাদ', 'পেয়েছি']
  },
  {
    id: 'gen_fridge_want',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: '"ফ্রিজ চাই" (1st reply)',
    question: 'দোকানের জন্য ডিপ ফ্রিজ চাই / Want freezer for shop',
    englishReply: `Dear Valued Customer,

Thank you for your interest.

We sincerely apologize, but new freezer allocations are currently unavailable.

Kindly share your full name, phone number, and complete shop address in our inbox. Subject to availability, our concerned team will contact you.
Thank you.`,
    banglaReply: `প্রিয় গ্রাহক,

আপনার আগ্রহের জন্য ধন্যবাদ।

আন্তরিকভাবে দুঃখিত, বর্তমানে নতুনভাবে ফ্রিজ প্রদান কার্যক্রম বন্ধ রয়েছে।

তবে অনুগ্রহ করে আপনার পূর্ণ নাম, মোবাইল নম্বর এবং দোকানের সম্পূর্ণ ঠিকানা আমাদের ইনবক্সে শেয়ার করুন। প্রাপ্যতা সাপেক্ষে আমাদের সংশ্লিষ্ট টিম আপনার সাথে যোগাযোগ করবে।
ধন্যবাদ।`,
    tags: ['fridge', 'freezer', 'ফ্রিজ', 'ফ্রিজ চাই', 'দোকানের ফ্রিজ']
  },
  {
    id: 'gen_fridge_want_2nd',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: '"ফ্রিজ চাই" (2nd reply)',
    question: 'ফ্রিজের তথ্য দেওয়ার পর ফলো-আপ রিপ্লাই',
    englishReply: `Dear Valued Customer,

Thank you for your patience.

Your information has already been shared with our Sales Team. The concerned representative will contact you, subject to availability.

Thank you for choosing Igloo.`,
    banglaReply: `প্রিয় গ্রাহক,

আপনার ধৈর্যের জন্য ধন্যবাদ।

আপনার তথ্য ইতোমধ্যে আমাদের সেলস টিমের সঙ্গে শেয়ার করা হয়েছে। প্রাপ্যতা সাপেক্ষে সংশ্লিষ্ট প্রতিনিধি আপনার সঙ্গে যোগাযোগ করবেন।

ইগলুর সঙ্গে থাকার জন্য ধন্যবাদ।`,
    tags: ['fridge 2nd', 'ফ্রিজ ফলোআপ', 'sales team']
  },
  {
    id: 'gen_greeting_hi',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'যদি কিছু না বলে / "Hi", "Hello"',
    question: 'শুধু Hi / Hello পাঠালে',
    englishReply: `Dear Valued Customer,

Kindly let us know how we may assist you. Please share your query, and we will be happy to help.

Thank you.`,
    banglaReply: `প্রিয় গ্রাহক,

দয়া করে বলবেন, কীভাবে আপনাকে সহযোগিতা করতে পারি? আপনার প্রশ্ন বা প্রয়োজনটি জানালে আমরা সর্বোচ্চ চেষ্টা করব আপনাকে সহায়তা করার।
ধন্যবাদ।`,
    tags: ['hi', 'hello', 'হাই', 'হ্যালো', 'greeting']
  },
  {
    id: 'gen_sponsorship',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'Sponsorship Proposal',
    question: 'স্পন্সরশিপ বা ইভেন্ট পার্টনারশিপের প্রস্তাব',
    englishReply: `Dear Valued Customer,

Thank you for your interest in collaborating with Igloo.

Kindly send your proposal to our Marketing Team at marketing.igloo@amlbd.com

If your proposal aligns with our requirements, our team will contact you using the email address or phone number provided in your proposal.
Thank you for your interest and consideration.`,
    banglaReply: `প্রিয় গ্রাহক,

ইগলুর সঙ্গে কাজ করার আগ্রহ প্রকাশ করার জন্য আপনাকে ধন্যবাদ।

অনুগ্রহ করে আপনার প্রস্তাবনা আমাদের Marketing Team-এর ইমেইল ঠিকানায় পাঠান:

marketing.igloo@amlbd.com

আপনার প্রস্তাবনা আমাদের প্রয়োজনের সঙ্গে সামঞ্জস্যপূর্ণ হলে, আমাদের টিম আপনার প্রদত্ত ইমেইল ঠিকানা অথবা মোবাইল নম্বরে যোগাযোগ করবে।

আপনার আগ্রহ ও সহযোগিতার জন্য ধন্যবাদ।`,
    tags: ['sponsorship', 'proposal', 'স্পন্সরশিপ', 'প্রস্তাব', 'marketing email']
  },
  {
    id: 'gen_payment_link',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'Why did the payment link come up?',
    question: 'পেমেন্ট লিংক কেন আসলো? ক্যাশ অন ডেলিভারি দেওয়া যাবে?',
    englishReply: `Dear Valued Customer,

This SMS has been sent as an option for your convenience.

If you would like to make your payment online, you may use the payment link provided in the SMS.

Otherwise, you may simply ignore the message, and your order will be delivered with the Cash on Delivery payment option.

Thank you for choosing Igloo.`,
    banglaReply: `প্রিয় গ্রাহক,

আপনার সুবিধার জন্য এই এসএমএসটি পাঠানো হয়েছে।

আপনি যদি অনলাইনে পেমেন্ট করতে চান, তাহলে এসএমএসে দেওয়া পেমেন্ট লিংকটি ব্যবহার করতে পারেন।

অন্যথায়, এসএমএসটি উপেক্ষা করলেও কোনো সমস্যা নেই। আপনার অর্ডারটি ক্যাশ অন ডেলিভারি (Cash on Delivery)-এর মাধ্যমে ডেলিভারি করা হবে।

ইগলুর সাথে থাকার জন্য ধন্যবাদ।`,
    tags: ['payment link', 'cod', 'cash on delivery', 'পেমেন্ট লিংক', 'ক্যাশ অন ডেলিভারি']
  },
  {
    id: 'gen_no_call_received',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'অর্ডার করেছি কিন্তু কোন কল পাইনি',
    question: 'ওয়েবসাইটে অর্ডার করার পর কনফার্মেশন কল আসেনি',
    englishReply: `Dear Valued Customer,

Thank you for your order.

One of our representatives will contact you shortly from 16556 to confirm your order.
Kindly receive the call so that we can proceed with your order.
Thank you for choosing Igloo.`,
    banglaReply: `প্রিয় গ্রাহক,

আপনার অর্ডারের জন্য ধন্যবাদ।

আপনার অর্ডার নিশ্চিত করার জন্য আমাদের একজন প্রতিনিধি শীঘ্রই ১৬৫৫৬ নম্বর থেকে আপনার সঙ্গে যোগাযোগ করবেন।
অনুগ্রহ করে কলটি রিসিভ করবেন, যাতে আমরা আপনার অর্ডারটি প্রক্রিয়া করতে পারি।
ইগলুর সাথে থাকার জন্য ধন্যবাদ।`,
    tags: ['no call', 'confirmation call', 'কল পাইনি', '16556']
  },
  {
    id: 'gen_ice_cream_melted',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'My ice cream is always melted',
    question: 'আইসক্রিম গলে যায় / গলানো অবস্থায় পেয়েছি',
    englishReply: `Dear Valued Customer,

We sincerely apologize for the experience you have had.

Thank you for bringing this matter to our attention. We take your feedback very seriously and would like to investigate the issue.

Kindly share the following details with us in our inbox:

* Product name
* Batch number
* MFG & EXP date
* Place of purchase
* A clear photo of the product and its packaging

Once we receive the details, we will forward the matter to our concerned team for further investigation and assist you accordingly.
Thank you for your patience and understanding.`,
    banglaReply: `প্রিয় গ্রাহক,

আপনার অভিজ্ঞতার জন্য আমরা আন্তরিকভাবে দুঃখিত।

বিষয়টি আমাদের নজরে আনার জন্য ধন্যবাদ। অনুগ্রহ করে বিষয়টি যাচাই করার জন্য আমাদের ইনবক্সে নিচের তথ্যগুলো শেয়ার করুন:

• পণ্যের নাম
• ব্যাচ নম্বর
• MFG ও EXP তারিখ
• কোথা থেকে পণ্যটি কিনেছেন
• পণ্য ও প্যাকেজিংয়ের পরিষ্কার ছবি

তথ্যগুলো পাওয়ার পর আমরা বিষয়টি সংশ্লিষ্ট টিমের কাছে তদন্তের জন্য পাঠাব এবং প্রয়োজনীয় সহায়তা প্রদান করব।
ধন্যবাদ।`,
    tags: ['melted', 'damage', 'গলে গেছে', 'গলানো', 'quality issue']
  },
  {
    id: 'gen_sandwich_discontinued',
    category: 'general',
    categoryLabel: 'General FAQs',
    topic: 'Sandwich',
    question: 'ইগলু স্যান্ডউইচ আইসক্রিম আছে কি?',
    englishReply: `Dear Valued Customer,

Thank you for your love and interest in our Ice Cream Sandwich.

We sincerely apologize, but this product has been discontinued and there are currently no plans to bring it back.

We truly appreciate your feedback and support. Thank you for choosing Igloo.`,
    banglaReply: `প্রিয় গ্রাহক,

ইগলু আইসক্রিম স্যান্ডউইচের প্রতি আপনার ভালোবাসা ও আগ্রহের জন্য ধন্যবাদ।

আন্তরিকভাবে দুঃখিত, এই পণ্যটির উৎপাদন বর্তমানে বন্ধ রয়েছে এবং এটি পুনরায় চালুর কোনো পরিকল্পনা নেই।

আপনার সমর্থনের জন্য আমরা কৃতজ্ঞ। ইগলুর সাথে থাকার জন্য ধন্যবাদ।`,
    tags: ['sandwich', 'discontinued', 'স্যান্ডউইচ', 'বন্ধ']
  },

  // --- 2. Facebook Comment Replies ---
  {
    id: 'comm_yummy',
    category: 'comments',
    categoryLabel: 'FB Comments',
    topic: '😍 Yummy! / ইয়ামি! / দারুণ লাগছে! / মজার লাগছে!',
    question: 'পজেটিভ কমেন্ট: Yummy / ইয়ামি / দারুণ / মজার',
    englishReply: `Dear Valued Customer,

Thank you so much for your lovely comment.
We're delighted to know you like it. We hope you enjoy every scoop of Igloo.
Thank you for choosing Igloo.`,
    banglaReply: `প্রিয় গ্রাহক,

আপনার সুন্দর মন্তব্য ও ভালোবাসার জন্য আন্তরিক ধন্যবাদ।
ইগলুর প্রতি আপনার ভালোবাসা জেনে আমরা সত্যিই আনন্দিত। আশা করি, ইগলুর প্রতিটি স্কুপ আপনার মুহূর্তগুলোকে আরও আনন্দময় করে তুলবে।
ইগলুর সাথে থাকার জন্য আন্তরিক ধন্যবাদ।`,
    tags: ['yummy', 'ইয়ামি', 'দারুণ', 'love', 'scoop']
  },
  {
    id: 'comm_looks_delicious',
    category: 'comments',
    categoryLabel: 'FB Comments',
    topic: 'Looks delicious! / দেখতে খুবই মজার লাগছে।',
    question: 'পজেটিভ কমেন্ট: Looks delicious / দেখতে সুন্দর',
    englishReply: `Dear Valued Customer,

Thank you for your kind comment.
We hope you get to enjoy your favorite Igloo ice cream very soon.
Thank you.`,
    banglaReply: `প্রিয় গ্রাহক,

আপনার সুন্দর মন্তব্যের জন্য ধন্যবাদ।
আশা করি, খুব শিগগিরই আপনি আপনার প্রিয় ইগলু আইসক্রিম উপভোগ করবেন।
ধন্যবাদ।`,
    tags: ['delicious', 'মজার লাগছে', 'দেখতে সুন্দর']
  },
  {
    id: 'comm_i_love_igloo',
    category: 'comments',
    categoryLabel: 'FB Comments',
    topic: 'I love Igloo / ইগলু আমার অনেক পছন্দ।',
    question: 'পজেটিভ কমেন্ট: I love Igloo / আমার অনেক পছন্দ',
    englishReply: `Dear Valued Customer,

Thank you for your love and support.
Your appreciation inspires us to serve you even better.
Thank you for choosing Igloo.`,
    banglaReply: `প্রিয় গ্রাহক,

ইগলুর প্রতি আপনার ভালোবাসা ও সমর্থনের জন্য আন্তরিক ধন্যবাদ। আপনার ভালোবাসাই আমাদের আরও ভালো সেবা দিতে অনুপ্রাণিত করে। ইগলুর সাথে থাকার জন্য ধন্যবাদ।`,
    tags: ['love igloo', 'ভালোবাসা', 'অনেক পছন্দ']
  },
  {
    id: 'comm_favorite',
    category: 'comments',
    categoryLabel: 'FB Comments',
    topic: 'My favorite ice cream. / আমার সবচেয়ে পছন্দের আইসক্রিম।',
    question: 'পজেটিভ কমেন্ট: My favorite ice cream',
    englishReply: `Dear Valued Customer,

Thank you for making Igloo your favorite.
Your support means a lot to us.`,
    banglaReply: `প্রিয় গ্রাহক,

ইগলুকে আপনার প্রিয় আইসক্রিম হিসেবে বেছে নেওয়ার জন্য আন্তরিক ধন্যবাদ।
আপনার ভালোবাসা ও সমর্থন আমাদের কাছে অত্যন্ত মূল্যবান।`,
    tags: ['favorite', 'প্রিয়', 'সবচেয়ে পছন্দ']
  },
  {
    id: 'comm_reduce_price',
    category: 'comments',
    categoryLabel: 'FB Comments',
    topic: 'Please reduce the price / দাম অনেক বেশি।',
    question: 'দাম কমানোর অনুরোধ বা প্রাইসিং ফিডব্যাক',
    englishReply: `Dear Valued Customer,

Thank you for your valuable feedback.

We truly appreciate your suggestion regarding the pricing. Your feedback will be shared with our concerned team for future consideration.

Thank you for choosing Igloo.`,
    banglaReply: `প্রিয় গ্রাহক,

আপনার মূল্যবান মতামতের জন্য আন্তরিক ধন্যবাদ।

পণ্যের মূল্য সম্পর্কে আপনার পরামর্শের জন্য আমরা কৃতজ্ঞ। আপনার মতামত ভবিষ্যৎ বিবেচনার জন্য আমাদের সংশ্লিষ্ট টিমের সঙ্গে শেয়ার করা হবে।

ইগলুর সাথে থাকার জন্য ধন্যবাদ।`,
    tags: ['reduce price', 'price high', 'দাম বেশি', 'দাম কমান']
  },

  // --- 3. Product FAQ — Mango Layers ---
  {
    id: 'prod_mango_layers_what',
    category: 'mango_layers',
    categoryLabel: 'Mango Layers',
    topic: "What is Mango Layers? / 'Mango Layers' আইসক্রিমটা কেমন?",
    question: "What is Mango Layers? / 'Mango Layers' আইসক্রিমটা কেমন?",
    englishReply: `Dear Valued Customer,

"Mango Layers" is a delicious double-layered frozen fruit dessert. It perfectly combines the irresistible taste of real Mango Pulp with smooth Mango-Flavored Ice Cream.

Thank you for choosing Igloo.`,
    banglaReply: `প্রিয় গ্রাহক,

"ম্যাংগো লেয়ারস" হলো একটি সুস্বাদু ফ্রোজেন ফ্রুট ডেজার্ট। এতে রয়েছে আসল আমের পাল্প এবং দারুণ স্বাদের ম্যাংগো ফ্লেভারড আইসক্রিমের এক পারফেক্ট কম্বিনেশন।

ইগলুর সাথে থাকার জন্য ধন্যবাদ।`,
    tags: ['mango layers', 'ম্যাংগো লেয়ারস', 'fruit dessert']
  },
  {
    id: 'prod_mango_layers_real_mango',
    category: 'mango_layers',
    categoryLabel: 'Mango Layers',
    topic: 'Is real mango used? / এতে কি আসল আম দেওয়া হয়েছে?',
    question: 'Is real mango used? / এতে কি আসল আম দেওয়া হয়েছে?',
    englishReply: `Dear Valued Customer,

Yes! It is crafted with an authentic fruit infusion, giving you the rich taste of real mango pulp.

Thank you for choosing Igloo.`,
    banglaReply: `প্রিয় গ্রাহক,

জি! এতে অথেনটিক ফ্রুট ইনফিউশন বা আসল আমের পাল্প ব্যবহার করা হয়েছে। এটি আপনাকে খাঁটি আমের দারুণ স্বাদ দেবে।

ইগলুর সাথে থাকার জন্য ধন্যবাদ।`,
    tags: ['real mango', 'আসল আম', 'mango pulp']
  },
  {
    id: 'prod_mango_layers_4layer',
    category: 'mango_layers',
    categoryLabel: 'Mango Layers',
    topic: 'What does 4-layer mean? / ৪-লেয়ার বলতে কী বোঝানো হয়েছে?',
    question: 'What does 4-layer mean? / ৪-লেয়ার বলতে কী বোঝানো হয়েছে?',
    englishReply: `Dear Valued Customer,

It features a unique 4-layer architecture consisting of 2 layers of rich mango pulp and 2 layers of creamy ice cream.

Thank you for choosing Igloo.`,
    banglaReply: `প্রিয় গ্রাহক,

এটি একটি ইউনিক ৪-লেয়ারের ডেজার্ট। এতে রয়েছে ২টি রিচ ম্যাংগো পাল্পের লেয়ার এবং ২টি ক্রিমি আইসক্রিমের লেয়ার।

ইগলুর সাথে থাকার জন্য ধন্যবাদ।`,
    tags: ['4 layer', '৪-লেয়ার', 'layers']
  },
  {
    id: 'prod_mango_layers_price',
    category: 'mango_layers',
    categoryLabel: 'Mango Layers',
    topic: 'Price & Order / দাম কত এবং কীভাবে অর্ডার করবো? (Mango Layers)',
    question: '৯০০ মিলি ম্যাংগো লেয়ারস এর দাম কত এবং অর্ডার লিংক',
    englishReply: `Dear Valued Customer,

The price of 900 ML Mango Layers Ice Cream is BDT 390.

To place an order, please visit our website at https://igloobd.com/product-details/mango-layers or call us at 16556 or 096 101 16556. Our customer service hours are from 9:00 AM to 6:00 PM.

Thank you for choosing Igloo.`,
    banglaReply: `প্রিয় গ্রাহক,

৯০০ মিলি ম্যাংগো লেয়ারস আইসক্রিমের মূল্য ৩৯০ টাকা।

অর্ডার করতে অনুগ্রহ করে আমাদের ওয়েবসাইট https://igloobd.com/product-details/mango-layers ভিজিট করুন অথবা ১৬৫৫৬ বা ০৯৬ ১০১ ১৬৫৫৬ নম্বরে কল করুন। আমাদের কাস্টমার সার্ভিস সকাল ৯:০০টা থেকে সন্ধ্যা ৬:০০টা পর্যন্ত খোলা থাকে।

ইগলুর সাথে থাকার জন্য ধন্যবাদ।`,
    tags: ['mango layers price', '৩৯০ টাকা', '390']
  },
  {
    id: 'prod_mango_layers_details',
    category: 'mango_layers',
    categoryLabel: 'Mango Layers',
    topic: 'Asking for Customer Details / অর্ডারের জন্য কাস্টমারের তথ্য চাওয়া',
    question: 'অর্ডারের জন্য নাম, ঠিকানা ও ফোন নম্বর চাওয়া',
    englishReply: `Dear Valued Customer,

If you would like to place an order, kindly share your name, phone number, delivery address, and let us know which product you would like to order.

Thank you for choosing Igloo. ❤️`,
    banglaReply: `প্রিয় গ্রাহক,

আপনি যদি অর্ডার করতে চান, অনুগ্রহ করে আপনার নাম, ফোন নম্বর, ডেলিভারি ঠিকানা এবং কোন পণ্যটি অর্ডার করতে চান তা আমাদের জানান।

ইগলুর সাথে থাকার জন্য ধন্যবাদ। ❤️`,
    tags: ['customer details', 'address', 'নাম ঠিকানা']
  },
  {
    id: 'prod_mango_layers_fusion_zero_combo',
    category: 'mango_layers',
    categoryLabel: 'Mango Layers',
    topic: 'Mango Layers, Mango Fusion & Zero Vanilla Combo',
    question: 'ম্যাংগো লেয়ারস, ম্যাংগো ফিউশন এবং জিরো ভ্যানিলা কম্বো (৳১০৩০)',
    englishReply: `Dear Valued Customer,
 
The price of the Mango Layers, Mango Fusion & Zero Vanilla Combo is BDT 1030.
 
To place an order, please visit our website at https://igloobd.com/product-details/mango-layers-mango-fusion-zero-vanilla-combo or call us at 16556 or 096 101 16556. Our customer service hours are from 9:00 AM to 6:00 PM.
 
Thank you for choosing Igloo.`,
    banglaReply: `প্রিয় গ্রাহক,
 
ম্যাংগো লেয়ারস, ম্যাংগো ফিউশন এবং জিরো ভ্যানিলা কম্বোটির মূল্য ১০৩০ টাকা।
 
অর্ডার করতে অনুগ্রহ করে আমাদের ওয়েবসাইট https://igloobd.com/product-details/mango-layers-mango-fusion-zero-vanilla-combo ভিজিট করুন অথবা ১৬৫৫৬ বা ০৯৬ ১০১ ১৬৫৫৬ নম্বরে কল করুন। আমাদের কাস্টমার সার্ভিস সকাল ৯:০০টা থেকে সন্ধ্যা ৬:০০টা পর্যন্ত খোলা থাকে।
 
ইগলুর সাথে থাকার জন্য ধন্যবাদ।`,
    tags: ['triple combo', '১০৩০ টাকা', '1030', 'zero combo']
  },
  {
    id: 'prod_mango_layers_fusion_combo',
    category: 'mango_layers',
    categoryLabel: 'Mango Layers',
    topic: 'Mango Layers & Mango Fusion combo',
    question: 'ম্যাংগো লেয়ারস এবং ম্যাংগো ফিউশন কম্বো (৳৭৮০)',
    englishReply: `Dear Valued Customer,
 
The price of the Mango Layers & Mango Fusion Combo is BDT 780.
 
To place an order, please visit our website at https://igloobd.com/product-details/mango-layers-mango-fusion-combo or call us at 16556 or 096 101 16556. Our customer service hours are from 9:00 AM to 6:00 PM.
 
Thank you for choosing Igloo.`,
    banglaReply: `প্রিয় গ্রাহক,
 
ম্যাংগো লেয়ারস এবং ম্যাংগো ফিউশন কম্বোটির মূল্য ৭৮০ টাকা।
 
অর্ডার করতে অনুগ্রহ করে আমাদের ওয়েবসাইট https://igloobd.com/product-details/mango-layers-mango-fusion-combo ভিজিট করুন অথবা ১৬৫৫৬ বা ০৯৬ ১০১ ১৬৫৫৬ নম্বরে কল করুন। আমাদের কাস্টমার সার্ভিস সকাল ৯:০০টা থেকে সন্ধ্যা ৬:০০টা পর্যন্ত খোলা থাকে।
 
ইগলুর সাথে থাকার জন্য ধন্যবাদ।`,
    tags: ['double combo', '৭৮০ টাকা', '780']
  },

  // --- 4. Product FAQ — Mango Fusion ---
  {
    id: 'prod_fusion_what',
    category: 'mango_fusion',
    categoryLabel: 'Mango Fusion',
    topic: "What is Mango Fusion? / 'Mango Fusion' আইসক্রিমটা কেমন?",
    question: "What is Mango Fusion? / 'Mango Fusion' আইসক্রিমটা কেমন?",
    englishReply: `Dear Valued Customer,
 
"Mango Fusion" is a deliciously crafted frozen fruit dessert. It brings together a 40% authentic mango blend with a flavorful mango mix for an ultra-creamy texture.
 
Thank you for choosing Igloo.`,
    banglaReply: `প্রিয় গ্রাহক,
 
"ম্যাংগো ফিউশন" হলো একটি সুস্বাদু ফ্রোজেন ফ্রুট ডেজার্ট। এতে রয়েছে ৪০% আসল আমের ব্লেন্ড এবং দারুণ স্বাদের ম্যাংগো মিক্স, যা আপনাকে দেবে আল্ট্রা-ক্রিমি টেক্সচার।
 
ইগলুর সাথে থাকার জন্য ধন্যবাদ।`,
    tags: ['mango fusion', 'ম্যাংগো ফিউশন', '40% mango']
  },
  {
    id: 'prod_fusion_real_mango',
    category: 'mango_fusion',
    categoryLabel: 'Mango Fusion',
    topic: 'Is real mango used? / এতে কি আসল আম দেওয়া হয়েছে? (Fusion)',
    question: 'Is real mango used? / এতে কি আসল আম দেওয়া হয়েছে?',
    englishReply: `Dear Valued Customer,
 
Yes! It features 40% real mango, giving you high-potency authentic tropical fruit richness.
 
Thank you for choosing Igloo.`,
    banglaReply: `প্রিয় গ্রাহক,
 
জি! এতে ৪০% আসল আম ব্যবহার করা হয়েছে, যা আপনাকে দেবে খাঁটি ট্রপিকাল ফলের দারুণ রিচনেস।
 
ইগলুর সাথে থাকার জন্য ধন্যবাদ।`,
    tags: ['fusion real mango', '৪০% আম']
  },
  {
    id: 'prod_fusion_price',
    category: 'mango_fusion',
    categoryLabel: 'Mango Fusion',
    topic: 'Price & Order / দাম কত এবং কীভাবে অর্ডার করবো? (Fusion)',
    question: '৯০০ মিলি ম্যাংগো ফিউশন এর দাম কত এবং অর্ডার লিংক',
    englishReply: `Dear Valued Customer,
 
The price of 900 ML Mango Fusion is BDT 390.
 
To place an order, please visit our website at https://igloobd.com/product-details/mango-fusion or call us at 16556 or 096 101 16556. Our customer service hours are from 9:00 AM to 6:00 PM.
 
Thank you for choosing Igloo.`,
    banglaReply: `প্রিয় গ্রাহক,
 
৯০০ মিলি ম্যাংগো ফিউশন আইসক্রিমের মূল্য ৩৯০ টাকা।
 
অর্ডার করতে অনুগ্রহ করে আমাদের ওয়েবসাইট https://igloobd.com/product-details/mango-fusion ভিজিট করুন অথবা ১৬৫৫৬ বা ০৯৬ ১০১ ১৬৫৫৬ নম্বরে কল করুন। আমাদের কাস্টমার সার্ভিস সকাল ৯:০০টা থেকে সন্ধ্যা ৬:০০টা পর্যন্ত খোলা থাকে।
 
ইগলুর সাথে থাকার জন্য ধন্যবাদ।`,
    tags: ['fusion price', '৩৯০ টাকা', '390']
  },
  {
    id: 'prod_fusion_special',
    category: 'mango_fusion',
    categoryLabel: 'Mango Fusion',
    topic: 'What is special about it? / এর বিশেষত্ব কী?',
    question: 'ম্যাংগো ফিউশনের বিশেষত্ব কী?',
    englishReply: `Dear Valued Customer,
 
It is the ultimate "Connoisseur Choice," created specifically for passionate mango lovers, delivering a velvety finish and ultra-smooth creamy mouthfeel.
 
Thank you for choosing Igloo.`,
    banglaReply: `প্রিয় গ্রাহক,
 
এটি প্যাশনেট ম্যাংগো লাভারদের জন্য স্পেশালি তৈরি করা হয়েছে, যা মুখে দিলেই মিলিয়ে যাওয়ার মতো ভেলভেটি ফিনিশ এবং আল্ট্রা-স্মুথ ক্রিমি টেক্সচার দেবে।
 
ইগলুর সাথে থাকার জন্য ধন্যবাদ।`,
    tags: ['connoisseur', 'velvety', 'বিশেষত্ব']
  },

  // --- 5. Product FAQ — Zero (Sugar-Conscious Frozen Dessert) ---
  {
    id: 'prod_zero_sugar_free',
    category: 'zero',
    categoryLabel: 'Zero Sugar-Conscious',
    topic: "Is it completely sugar-free? / Does 'Zero' mean absolutely zero sugar?",
    question: 'জিরো আইসক্রিমে কি একেবারেই চিনি নেই?',
    englishReply: `Dear Customer, No. It is free from table sugar (sucrose) and glucose compared with regular products. However, natural sugar such as lactose from milk solids is present as a component of milk. Thank you.`,
    banglaReply: `প্রিয় গ্রাহক, না। সাধারণ পণ্যের মতো এতে টেবিল সুগার (সুক্রোজ) এবং গ্লুকোজ নেই। তবে, দুধের উপাদান থাকায় এতে প্রাকৃতিকভাবে থাকা দুধের চিনি (ল্যাকটোজ) রয়েছে। ধন্যবাদ।`,
    tags: ['sugar free', 'zero sugar', 'চিনি নেই', 'সুক্রোজ', 'ল্যাকটোজ']
  },
  {
    id: 'prod_zero_palm_oil',
    category: 'zero',
    categoryLabel: 'Zero Sugar-Conscious',
    topic: 'Does this product contain palm oil?',
    question: 'এতে কি পাম অয়েল আছে?',
    englishReply: `Dear Customer, No. It contains milk fat and coconut oil, which is a source of medium-chain fatty acids. Thank you.`,
    banglaReply: `প্রিয় গ্রাহক, না। এতে মিল্ক ফ্যাট এবং কোকোনাট অয়েল রয়েছে, যা মিডিয়াম-চেইন ফ্যাটি এসিডের একটি উৎস। ধন্যবাদ।`,
    tags: ['palm oil', 'পাম অয়েল', 'coconut oil', 'নারকেল তেল']
  },
  {
    id: 'prod_zero_diabetes',
    category: 'zero',
    categoryLabel: 'Zero Sugar-Conscious',
    topic: 'Is it suitable for people with diabetes?',
    question: 'ডায়াবেটিস রোগীরা কি এটা খেতে পারবে?',
    englishReply: `Dear Customer, No. It is suitable only for sugar-conscious consumers. Thank you.`,
    banglaReply: `প্রিয় গ্রাহক, না। এটি শুধুমাত্র চিনি সম্পর্কে সচেতন (sugar-conscious) গ্রাহকদের জন্য উপযুক্ত। ধন্যবাদ।`,
    tags: ['diabetes', 'ডায়াবেটিস', 'sugar conscious']
  },
  {
    id: 'prod_zero_diff_ice_cream',
    category: 'zero',
    categoryLabel: 'Zero Sugar-Conscious',
    topic: 'Difference between ice cream and frozen dessert?',
    question: 'আইসক্রিম ও ফ্রোজেন ডেজার্টের মধ্যে পার্থক্য কী?',
    englishReply: `Dear Customer, Ice cream is characterized according to BDS standards, including a maximum sugar content of 16%. However, in this product, sugar replacers are used instead of added sugar, so it is categorized as a Frozen Dessert. Thank you.`,
    banglaReply: `প্রিয় গ্রাহক, বিডিএস (BDS) স্ট্যান্ডার্ড অনুযায়ী আইসক্রিমে সর্বোচ্চ ১৬% চিনি থাকতে হয়। কিন্তু এই পণ্যে চিনি যোগ করার বদলে সুগার রিপ্লেসার ব্যবহার করা হয়েছে, তাই একে ফ্রোজেন ডেজার্ট হিসেবে তালিকাভুক্ত করা হয়েছে। ধন্যবাদ।`,
    tags: ['frozen dessert', 'bds standard', 'ফ্রোজেন ডেজার্ট']
  },
  {
    id: 'prod_zero_calories_500ml',
    category: 'zero',
    categoryLabel: 'Zero Sugar-Conscious',
    topic: 'How many calories are there in a 500 ml tub?',
    question: '৫০০ মিলি বক্সে কত ক্যালরি থাকে?',
    englishReply: `Dear Customer, The product provides 167 kcal per 100 g, equivalent to approximately 496 kcal per 500 ml tub. Thank you.`,
    banglaReply: `প্রিয় গ্রাহক, এই পণ্যটিতে প্রতি ১০০ গ্রামে ১৬৭ কিলোক্যালরি রয়েছে, যা একটি ৫০০ মিলি বক্সে প্রায় ৪৯৬ কিলোক্যালরির সমান। ধন্যবাদ।`,
    tags: ['calories', '496 kcal', 'ক্যালরি', '167 kcal']
  },
  {
    id: 'prod_zero_calories_compare',
    category: 'zero',
    categoryLabel: 'Zero Sugar-Conscious',
    topic: 'Calorie comparison to regular Vanilla ice cream',
    question: 'রেগুলার ভ্যানিলার চেয়ে ক্যালরি কত কম?',
    englishReply: `Dear Customer, Zero Frozen Dessert contains 167.16 kcal per 100 g, whereas regular Vanilla Ice Cream contains 198.34 kcal per 100 g, as mentioned on the respective product labels. Thank you.`,
    banglaReply: `প্রিয় গ্রাহক, জিরো ফ্রোজেন ডেজার্টে প্রতি ১০০ গ্রামে ১৬৭.১৬ কিলোক্যালরি রয়েছে, যেখানে রেগুলার ভ্যানিলা আইসক্রিমে প্রতি ১০০ গ্রামে ১৯৮.৩৪ কিলোক্যালরি থাকে (যা লেবেলে উল্লেখ করা আছে)। ধন্যবাদ।`,
    tags: ['compare calories', 'তুলনা', 'vanilla']
  },
  {
    id: 'prod_zero_sweetener',
    category: 'zero',
    categoryLabel: 'Zero Sugar-Conscious',
    topic: 'What kind of sweetener is used?',
    question: 'মিষ্টির জন্য কী ব্যবহার করা হয়েছে?',
    englishReply: `Dear Customer, The product uses plant-derived, food-grade Steviol, in combination with polyol (Erythritol) and Maltodextrin as a bulking agent. Thank you.`,
    banglaReply: `প্রিয় গ্রাহক, এই পণ্যটিতে উদ্ভিদ থেকে তৈরি ফুড-গ্রেড স্টিভিওল (Steviol), এবং এর সাথে পলিওল (এরিথ্রিটল) ও মাল্টোডেক্সট্রিন ব্যবহার করা হয়েছে। ধন্যবাদ।`,
    tags: ['sweetener', 'steviol', 'স্টিভিওল', 'মিষ্টি']
  },
  {
    id: 'prod_zero_dairy',
    category: 'zero',
    categoryLabel: 'Zero Sugar-Conscious',
    topic: 'Does it contain dairy?',
    question: 'এতে কি দুধ বা ডেইরি উপাদান আছে?',
    englishReply: `Dear Customer, Yes. It contains milk solids, including milk fat and milk solid non-fat, as dairy ingredients. Thank you.`,
    banglaReply: `প্রিয় গ্রাহক, হ্যাঁ। এতে ডেইরি উপাদান হিসেবে মিল্ক সলিড রয়েছে, যার মধ্যে মিল্ক ফ্যাট এবং মিল্ক সলিড নন-ফ্যাট অন্তর্ভুক্ত। ধন্যবাদ।`,
    tags: ['dairy', 'milk', 'দুধ']
  },
  {
    id: 'prod_zero_ingredients',
    category: 'zero',
    categoryLabel: 'Zero Sugar-Conscious',
    topic: "What are the ingredients used in 'Zero'?",
    question: 'জিরো পণ্যের উপাদানগুলো কী কী?',
    englishReply: `Dear Customer, The ingredients mentioned on the label include treated water, milk solids, coconut oil, sugar alternatives (Steviol and Erythritol), Maltodextrin, emulsifier and stabilizer, and permitted food-grade color and flavor. Thank you.`,
    banglaReply: `প্রিয় গ্রাহক, লেবেলে উল্লেখিত উপাদানগুলোর মধ্যে রয়েছে ট্রিটেড পানি, মিল্ক সলিড, কোকোনাট অয়েল, চিনির বিকল্প (স্টিভিওল এবং এরিথ্রিটল), মাল্টোডেক্সট্রিন, ইমালসিফায়ার, স্টেবিলাইজার এবং অনুমোদিত ফুড-গ্রেড কালার ও ফ্লেভার। ধন্যবাদ।`,
    tags: ['ingredients', 'উপাদান', 'উপকরণ']
  },

  // --- 8. Dealership / Escalation ---
  {
    id: 'esc_rsm_policy',
    category: 'escalation',
    categoryLabel: 'Escalation Policy',
    topic: 'Dealership / Regional Sales Escalation Policy',
    question: 'ডিলারশিপ সংক্রান্ত ইন্টারনাল এসকেলেশন পলিসি',
    englishReply: `For dealership inquiries: Ask the customer for their district/area, then forward internally to the relevant Regional Sales Manager (RSM) for that zone/division — do NOT share RSM personal phone numbers directly with customers unless explicit policy allows it.`,
    banglaReply: `ডিলারশিপ অনুসন্ধানের জন্য: কাস্টমারের জেলা/এলাকা জেনে নিন, এরপর সংশ্লিষ্ট জোন/ডিভিশনের Regional Sales Manager (RSM)-এর কাছে ইন্টারনালি ফরওয়ার্ড করুন — নির্দিষ্ট অনুমোদন ছাড়া কাস্টমারকে সরাসরি RSM-এর ব্যক্তিগত মোবাইল নম্বর দেওয়া নিষেধ।`,
    tags: ['rsm policy', 'escalation', 'এসকেলেশন', 'গোপনীয়তা']
  }
];

export const OFFICIAL_PRICE_LIST: PriceListItem[] = [
  // Stick Normal
  { id: 'pr_1', category: 'Stick Normal', product: 'CHOCBAR', volume: 70, unit: 'ml', pricePerPcs: 35, pricePerCarton: 840 },
  { id: 'pr_2', category: 'Stick Normal', product: 'CHOCBAR INSTA', volume: 65, unit: 'ml', pricePerPcs: 30, pricePerCarton: 720 },
  { id: 'pr_3', category: 'Stick Normal', product: 'SHELL & CORE', volume: 58, unit: 'ml', pricePerPcs: 30, pricePerCarton: 750 },
  { id: 'pr_4', category: 'Stick Normal', product: 'LOLLY - LEMON', volume: 58, unit: 'ml', pricePerPcs: 20, pricePerCarton: 500 },
  { id: 'pr_5', category: 'Stick Normal', product: 'LOLLY - ORANGE', volume: 58, unit: 'ml', pricePerPcs: 20, pricePerCarton: 500 },
  { id: 'pr_6', category: 'Stick Normal', product: 'LOLLY - LYCHEE', volume: 58, unit: 'ml', pricePerPcs: 25, pricePerCarton: 625 },
  { id: 'pr_7', category: 'Stick Normal', product: 'LOLLY - WATERMELON', volume: 58, unit: 'ml', pricePerPcs: 25, pricePerCarton: 625 },
  { id: 'pr_8', category: 'Stick Normal', product: 'DUDH MALAI', volume: 50, unit: 'ml', pricePerPcs: 20, pricePerCarton: 625 },

  // Stick Premium
  { id: 'pr_9', category: 'Stick Premium', product: 'EGO', volume: 75, unit: 'ml', pricePerPcs: 100, pricePerCarton: 1200 },
  { id: 'pr_10', category: 'Stick Premium', product: 'MEGA', volume: 100, unit: 'ml', pricePerPcs: 50, pricePerCarton: 960 },
  { id: 'pr_11', category: 'Stick Premium', product: 'MACHO', volume: 100, unit: 'ml', pricePerPcs: 50, pricePerCarton: 960 },
  { id: 'pr_12', category: 'Stick Premium', product: 'LOLLY - KIWI', volume: 58, unit: 'ml', pricePerPcs: 30, pricePerCarton: 750 },
  { id: 'pr_13', category: 'Stick Premium', product: 'LOLLY - PEACH', volume: 58, unit: 'ml', pricePerPcs: 30, pricePerCarton: 750 },
  { id: 'pr_14', category: 'Stick Premium', product: 'ALMOND SPLIT (EXOTIC BAR)', volume: 100, unit: 'ml', pricePerPcs: 180, pricePerCarton: 1800 },
  { id: 'pr_15', category: 'Stick Premium', product: 'SWISS CHOCOLATE (EXOTIC BAR)', volume: 100, unit: 'ml', pricePerPcs: 180, pricePerCarton: 1800 },

  // Regular Cup
  { id: 'pr_16', category: 'Regular Cup', product: 'VANILLA', volume: 100, unit: 'ml', pricePerPcs: 30, pricePerCarton: 540 },
  { id: 'pr_17', category: 'Regular Cup', product: 'STRAWBERRY', volume: 100, unit: 'ml', pricePerPcs: 30, pricePerCarton: 540 },
  { id: 'pr_18', category: 'Regular Cup', product: 'CHOCOLATE', volume: 100, unit: 'ml', pricePerPcs: 30, pricePerCarton: 540 },
  { id: 'pr_19', category: 'Regular Cup', product: 'MANGO', volume: 100, unit: 'ml', pricePerPcs: 30, pricePerCarton: 540 },
  { id: 'pr_20', category: 'Regular Cup', product: 'SNOWBALL/FOOTBALL', volume: 100, unit: 'ml', pricePerPcs: 35, pricePerCarton: 700 },
  { id: 'pr_21', category: 'Regular Cup', product: 'MANGO MAGIC', volume: 125, unit: 'ml', pricePerPcs: 35, pricePerCarton: 700 },

  // Premium Cup
  { id: 'pr_22', category: 'Premium Cup', product: 'ICE CAFÉ', volume: 100, unit: 'ml', pricePerPcs: 60, pricePerCarton: 720 },
  { id: 'pr_23', category: 'Premium Cup', product: 'NUTRICKS', volume: 100, unit: 'ml', pricePerPcs: 60, pricePerCarton: 720 },
  { id: 'pr_24', category: 'Premium Cup', product: 'DOI FROZEN DESSERT', volume: 100, unit: 'ml', pricePerPcs: 70, pricePerCarton: 840 },
  { id: 'pr_25', category: 'Premium Cup', product: 'BLACK FOREST', volume: 100, unit: 'ml', pricePerPcs: 70, pricePerCarton: 840 },
  { id: 'pr_26', category: 'Premium Cup', product: 'KHEER MALAI', volume: 100, unit: 'ml', pricePerPcs: 70, pricePerCarton: 840 },
  { id: 'pr_27', category: 'Premium Cup', product: 'BLUEBERRY YOGHURT', volume: 100, unit: 'ml', pricePerPcs: 100, pricePerCarton: 1200 },
  { id: 'pr_28', category: 'Premium Cup', product: 'STRAWBERRY CHEESE CAKE', volume: 100, unit: 'ml', pricePerPcs: 100, pricePerCarton: 1200 },
  { id: 'pr_29', category: 'Premium Cup', product: 'SINGLE SUNDAE', volume: 120, unit: 'ml', pricePerPcs: 50, pricePerCarton: 600 },

  // Mini Cone
  { id: 'pr_30', category: 'Mini Cone', product: 'CORNELLI CLASSIC', volume: 85, unit: 'ml', pricePerPcs: 40, pricePerCarton: 960 },
  { id: 'pr_31', category: 'Mini Cone', product: 'BELGIAN CHOCOLATE', volume: 85, unit: 'ml', pricePerPcs: 45, pricePerCarton: 1080 },

  // Regular Cone
  { id: 'pr_32', category: 'Regular Cone', product: 'CORNELLI CLASSIC', volume: 115, unit: 'ml', pricePerPcs: 60, pricePerCarton: 840 },
  { id: 'pr_33', category: 'Regular Cone', product: 'BELGIAN CHOCOLATE', volume: 115, unit: 'ml', pricePerPcs: 70, pricePerCarton: 980 },

  // 1 L Regular
  { id: 'pr_34', category: '1 L Regular', product: 'VANILLA', volume: 1000, unit: 'ml', pricePerPcs: 300, pricePerCarton: 300 },
  { id: 'pr_35', category: '1 L Regular', product: 'STRAWBERRY', volume: 1000, unit: 'ml', pricePerPcs: 300, pricePerCarton: 300 },
  { id: 'pr_36', category: '1 L Regular', product: 'MANGO', volume: 1000, unit: 'ml', pricePerPcs: 300, pricePerCarton: 300 },
  { id: 'pr_37', category: '1 L Regular', product: 'CHOCOLATE', volume: 1000, unit: 'ml', pricePerPcs: 300, pricePerCarton: 300 },

  // 1 L Double Sundae
  { id: 'pr_38', category: '1 L Double Sundae', product: 'MANGO MELODY', volume: 1000, unit: 'ml', pricePerPcs: 350, pricePerCarton: 350 },
  { id: 'pr_39', category: '1 L Double Sundae', product: 'STRAWBERRY SPARKLE', volume: 1000, unit: 'ml', pricePerPcs: 350, pricePerCarton: 350 },
  { id: 'pr_40', category: '1 L Double Sundae', product: 'CHOCOLATE CHEERS', volume: 1000, unit: 'ml', pricePerPcs: 350, pricePerCarton: 350 },
  { id: 'pr_41', category: '1 L Double Sundae', product: 'CARAMEL COMBO', volume: 1000, unit: 'ml', pricePerPcs: 350, pricePerCarton: 350 },

  // 1 L Dessert
  { id: 'pr_42', category: '1 L Dessert', product: 'NAWABI MITHAI', volume: 1000, unit: 'ml', pricePerPcs: 400, pricePerCarton: 400 },
  { id: 'pr_43', category: '1 L Dessert', product: 'RASH MALAI', volume: 1000, unit: 'ml', pricePerPcs: 450, pricePerCarton: 450 },
  { id: 'pr_44', category: '1 L Dessert', product: 'KHEER MALAI', volume: 1000, unit: 'ml', pricePerPcs: 400, pricePerCarton: 400 },
  { id: 'pr_45', category: '1 L Dessert', product: 'DOI FROZEN DESSERT', volume: 1000, unit: 'ml', pricePerPcs: 450, pricePerCarton: 450 },
  { id: 'pr_46', category: '1 L Dessert', product: 'ICE CAFÉ', volume: 1000, unit: 'ml', pricePerPcs: 350, pricePerCarton: 350 },
  { id: 'pr_47', category: '1 L Dessert', product: 'AMBROSIA', volume: 1000, unit: 'ml', pricePerPcs: 400, pricePerCarton: 400 },
  { id: 'pr_48', category: '1 L Dessert', product: 'BUTTERSCOTCH', volume: 1000, unit: 'ml', pricePerPcs: 400, pricePerCarton: 400 },

  // 1 L Premium
  { id: 'pr_49', category: '1 L Premium', product: 'BLUEBERRY YOGHURT', volume: 1000, unit: 'ml', pricePerPcs: 600, pricePerCarton: 795 },
  { id: 'pr_50', category: '1 L Premium', product: 'BUTTER PECAN', volume: 1000, unit: 'ml', pricePerPcs: 600, pricePerCarton: 600 },
  { id: 'pr_51', category: '1 L Premium', product: 'FRENCH VANILLA', volume: 1000, unit: 'ml', pricePerPcs: 500, pricePerCarton: 795 },
  { id: 'pr_52', category: '1 L Premium', product: 'STRAWBERRY CHEESECAKE', volume: 1000, unit: 'ml', pricePerPcs: 500, pricePerCarton: 795 },
  { id: 'pr_53', category: '1 L Premium', product: 'RED VELVET', volume: 1000, unit: 'ml', pricePerPcs: 600, pricePerCarton: 795 },

  // Cake
  { id: 'pr_54', category: 'Cake', product: 'RIPPLE CAKE 1 LITER', volume: 1000, unit: 'ml', pricePerPcs: 500, pricePerCarton: 500 },

  // 2 L Regular
  { id: 'pr_55', category: '2 L Regular', product: 'VANILLA', volume: 2000, unit: 'ml', pricePerPcs: 520, pricePerCarton: 520 },
  { id: 'pr_56', category: '2 L Regular', product: 'STRAWBERRY', volume: 2000, unit: 'ml', pricePerPcs: 520, pricePerCarton: 520 },
  { id: 'pr_57', category: '2 L Regular', product: 'CHOCOLATE', volume: 2000, unit: 'ml', pricePerPcs: 520, pricePerCarton: 520 },
  { id: 'pr_58', category: '2 L Regular', product: 'MANGO', volume: 2000, unit: 'ml', pricePerPcs: 520, pricePerCarton: 520 },
];
