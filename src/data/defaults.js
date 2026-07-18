export const DEFAULT_FLEET = [
  { id: 1, name: 'Toyota Prado', year: '2003-2010', passengers: 6, fuel: 'Petrol', price: 18000, fuelCost: 10000, status: 'available', img: 'https://cdn.builder.io/api/v1/image/assets%2Ffdd56951636c4281af1ff3e14802ea36%2F48b029d29fe64defafe3b20cee55f166?format=webp&width=400' },
  { id: 2, name: 'Toyota Prado', year: '1998-2002', passengers: 6, fuel: 'Petrol', price: 16000, fuelCost: 9000, status: 'available', img: 'https://cdn.builder.io/api/v1/image/assets%2Ffdd56951636c4281af1ff3e14802ea36%2F7db49ef62cf04a0687fddeb3b77f5457?format=webp&width=400' },
  { id: 3, name: 'Toyota Prado', year: '2013-2020', passengers: 6, fuel: 'Petrol', price: 29000, fuelCost: 11000, status: 'available', img: 'https://cdn.builder.io/api/v1/image/assets%2Ffdd56951636c4281af1ff3e14802ea36%2F344e35fb4f974686bb15cae7d5325103?format=webp&width=400' },
  { id: 4, name: 'Toyota Corolla', year: 'Sedan', passengers: 4, fuel: 'Petrol', price: 11000, fuelCost: 6000, status: 'available', img: 'https://mediumvioletred-hedgehog-139961.hostingersite.com/img/Corolla%20.jpg' },
  { id: 5, name: 'Toyota Premio', year: 'Sedan', passengers: 4, fuel: 'Petrol', price: 12000, fuelCost: 6000, status: 'booked', img: 'https://mediumvioletred-hedgehog-139961.hostingersite.com/img/Premio.jpg' },
  { id: 6, name: 'Toyota Grand Cabin', year: 'Van', passengers: 13, fuel: 'Petrol', price: 21000, fuelCost: 8000, status: 'available', img: 'https://mediumvioletred-hedgehog-139961.hostingersite.com/img/Grand%20Cabin.jpeg' },
];

export const DEFAULT_TOURS = [
  { id: 1, title: 'Skardu, Shigar, Kharmang & Khaplu', duration: '5 Days / 4 Nights', price: 75000, persons: 2, status: 'active', img: 'https://mediumvioletred-hedgehog-139961.hostingersite.com/img/skardu.webp', highlights: 'Shangrila Resort, Katpana Dunes, Shigar Fort, Manthoka Waterfall, Khaplu Valley' },
  { id: 2, title: 'Skardu, Shigar, Hunza & Deosai', duration: '8 Days / 7 Nights', price: 170000, persons: 2, status: 'active', img: 'https://mediumvioletred-hedgehog-139961.hostingersite.com/img/skardu1.png', highlights: 'Kachura Lakes, Shigar Valley, Deosai National Park' },
  { id: 3, title: 'Skardu Extended — Kharmang & Khaplu', duration: '8 Days / 7 Nights', price: 165000, persons: 2, status: 'active', img: 'https://mediumvioletred-hedgehog-139961.hostingersite.com/img/skardu2.jpg', highlights: 'Complete Skardu, Manthoka Waterfall, Basho Valley, Deosai' },
  { id: 4, title: 'Machulo La Trek (K2 Viewpoint)', duration: '3 Days / 3 Nights', price: 100000, persons: 2, status: 'active', img: 'https://mediumvioletred-hedgehog-139961.hostingersite.com/img/macholo.webp', highlights: 'K2 Viewpoint at 5,200m, Khady Broq, Machulo La camping' },
  { id: 5, title: 'Nangma Valley Trek', duration: '2 Days / 2 Nights', price: 90000, persons: 2, status: 'active', img: 'https://mediumvioletred-hedgehog-139961.hostingersite.com/img/nangma%20vally.jpg', highlights: 'Pristine Nangma Valley, Mingulo Broq, Mountain meadows & glaciers' },
];

export const DEFAULT_INQUIRIES = [
  { id: 1, name: 'Ahmed Khan', phone: '+92 300 1234567', msg: 'I need to book Toyota Prado for 5 days for K2 Base Camp trip.', tour: 'Fleet — Prado 2013-2020', date: '2026-07-05', time: '09:14 AM', status: 'unread' },
  { id: 2, name: 'Sara Malik', phone: '+92 321 9876543', msg: 'Interested in 8-day Hunza tour package for family of 4 persons.', tour: 'Hunza & Deosai Package', date: '2026-07-04', time: '03:45 PM', status: 'unread' },
  { id: 3, name: 'Bilal Hussain', phone: '+92 333 5551234', msg: 'What is the group discount for Grand Cabin for 10+ days?', tour: 'Fleet — Grand Cabin', date: '2026-07-04', time: '11:22 AM', status: 'unread' },
  { id: 4, name: 'Nadia Iqbal', phone: '+92 311 7770001', msg: 'Would like to plan a custom corporate trip for 20 people to Deosai.', tour: 'Custom Tour', date: '2026-07-03', time: '05:00 PM', status: 'read' },
  { id: 5, name: 'Usman Tariq', phone: '+92 345 2223344', msg: 'Nangma Valley trek booking for 2 persons — available this month?', tour: 'Nangma Valley Trek', date: '2026-07-02', time: '08:30 AM', status: 'read' },
];

export const DEFAULT_DESTINATIONS = [
  { id: 1, name: 'Deosai National Park', desc: 'Land of Giants', img: 'https://mediumvioletred-hedgehog-139961.hostingersite.com/img/deosai-national-park.webp' },
  { id: 2, name: 'Katpana Cold Desert', desc: 'Unique sand dunes', img: 'https://mediumvioletred-hedgehog-139961.hostingersite.com/img/katpana-cold-desert.webp' },
  { id: 3, name: 'Manthoka Waterfall', desc: 'Natural beauty', img: 'https://mediumvioletred-hedgehog-139961.hostingersite.com/img/manthkha.jpg' },
  { id: 4, name: 'Shangrila Resort', desc: 'Lower Kachura Lake', img: 'https://mediumvioletred-hedgehog-139961.hostingersite.com/img/shangrila-resort-lake.webp' },
];

export const DEFAULT_SETTINGS = {
  siteName: 'Skardu Explore',
  phone: '+92 318 227 7086',
  whatsapp: '923182277086',
  email: 'skarduexplore@gmial.com',
  address: 'Main Bazaar, Skardu, Gilgit-Baltistan',
  facebook: 'https://www.facebook.com/people/Alpine-Tours-Skardu/100077133245114/',
  instagram: 'https://www.instagram.com/incredibleskardu',
  currency: 'PKR',
};
