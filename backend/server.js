const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Use body parser middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Pricing data (hardcoded for example)
const getData = () => {
  let pricingData = [
    { symbol: 'RDSA', name: 'Royal Dutch Shell', eventDate: '2023-11-12'},
    { symbol: 'ULVR', name: 'Unilever', eventDate: '2023-10-25'},
    { symbol: 'HSBA', name: 'HSBC', eventDate: '2023-09-12', price: 88.11},
    { symbol: 'BATS', name: 'British American Tobacco', eventDate: '2023-09-23'},
    { symbol: 'GSK', name: 'GlaxoSmithKline', eventDate: '2023-10-05', price: 67.38},
    { symbol: 'SAB', name: 'SABMiller', eventDate: '2023-04-11', price: 67.32},
    { symbol: 'BP', name: 'BP', eventDate: '2023-08-30', price: 63.13},
    { symbol: 'VOD', name: 'Vodafone Group', eventDate: '2023-08-11', price: 56.55},
    { symbol: 'AZN', name: 'AstraZeneca', eventDate: '2023-07-17', price: 51.23},
    { symbol: 'RB', name: 'Reckitt Benckiser', eventDate: '2023-06-30', price: 46.32},
    { symbol: 'DGE', name: 'Diageo', eventDate: '2023-05-21', price: 46.01},
    { symbol: 'BT.A', name: 'BT Group', eventDate: '2023-11-14', price: 45.61},
    { symbol: 'LLOY', name: 'Lloyds Banking Group', eventDate: '2023-06-17', price: 44.11},
    { symbol: 'BLT', name: 'BHP Billiton', eventDate: '2023-09-12', price: 41.88},
    { symbol: 'NG', name: 'National Grid plc', eventDate: '2023-05-11', price: 36.14},
    { symbol: 'IMB', name: 'Imperial Brands', eventDate: '2023-02-16', price: 35.78},
    { symbol: 'RIO', name: 'Rio Tinto Group', eventDate: '2023-03-22', price: 34.84},
    { symbol: 'PRU', name: 'Prudential plc', eventDate: '2023-04-18', price: 31.63},
    { symbol: 'RBS', name: 'Royal Bank of Scotland Group', eventDate: '2023-05-26', price: 28.6},
    { symbol: 'BARC', name: 'Barclays', eventDate: '2023-02-24', price: 27.18},
    { symbol: 'ABF', name: 'Associated British Foods', eventDate: '2023-06-21', price: 25.77},
    { symbol: 'REL', name: 'RELX Group', eventDate: '2023-06-23', price: 25.54},
    { symbol: 'REX', name: 'Rexam', eventDate: '2023-03-20', price: 25.54},
    { symbol: 'CCL', name: 'Carnival Corporation & plc', eventDate: '2023-02-15', price: 24.85},
    { symbol: 'SHP', name: 'Shire plc', eventDate: '2023-10-15', price: 22.52},
    { symbol: 'CPG', name: 'Compass Group', eventDate: '2023-02-21', price: 20.21},
    { symbol: 'WPP', name: 'WPP plc', eventDate: '2023-01-05', price: 19.01},
    { symbol: 'AV.', name: 'Aviva', eventDate: '2023-04-01', price: 17.69},
    { symbol: 'SKY', name: 'Sky plc', eventDate: '2023-10-15', price: 17.5},
    { symbol: 'GLEN', name: 'Glencore', eventDate: '2023-05-04', price: 16.96},
    { symbol: 'BA.', name: 'BAE Systems', eventDate: '2023-02-06', price: 16.01},
    { symbol: 'TSCO', name: 'Tesco', eventDate: '2023-02-15', price: 14.92},
    { symbol: 'SSE', name: 'SSE plc', eventDate: '2023-11-07', price: 14.03},
    { symbol: 'STAN', name: 'Standard Chartered', eventDate: '2023-01-15', price: 13.52},
    { symbol: 'LGEN', name: 'Legal & General', eventDate: '2023-11-08', price: 13.21},
    { symbol: 'ARM', name: 'ARM Holdings', eventDate: '2023-01-09', price: 13.2},
    { symbol: 'RR.', name: 'Rolls-Royce Holdings', eventDate: '2023-05-03', price: 11.8},
    { symbol: 'EXPN', name: 'Experian', eventDate: '2023-11-10', price: 11.1},
    { symbol: 'IAG', name: 'International Consolidated Airlines Group SA', eventDate: '2023-11-02', price: 11.01},
    { symbol: 'CRH', name: 'CRH plc', eventDate: '2023-03-12', price: 10.9},
    { symbol: 'CNA', name: 'Centrica', eventDate: '2023-02-05', price: 10.72},
    { symbol: 'SN.', name: 'Smith & Nephew', eventDate: '2023-02-16', price: 10.27},
    { symbol: 'ITV', name: 'ITV plc', eventDate: '2023-01-21', price: 10.15},
    { symbol: 'WOS', name: 'Wolseley plc', eventDate: '2023-08-24', price: 9.2},
    { symbol: 'OML', name: 'Old Mutual', eventDate: '2023-05-22', price: 8.45},
    { symbol: 'LAND', name: 'Land Securities', eventDate: '2023-07-19', price: 8.19},
    { symbol: 'LSE', name: 'London Stock Exchange Group', eventDate: '2023-05-22', price: 8.06},
    { symbol: 'KGF', name: 'Kingfisher plc', eventDate: '2023-03-25', price: 7.8},
    { symbol: 'CPI', name: 'Capita', eventDate: '2023-02-15', price: 7.38},
    { symbol: 'BLND', name: 'British Land', eventDate: '2023-04-23', price: 7.13},
    { symbol: 'WTB', name: 'Whitbread', eventDate: '2023-08-15', price: 7.09},
    { symbol: 'MKS', name: 'Marks & Spencer', eventDate: '2023-01-20', price: 7.01},
    { symbol: 'FRES', name: 'Fresnillo plc', eventDate: '2023-05-03', price: 6.99},
    { symbol: 'NXT', name: 'Next plc', eventDate: '2023-06-27', price: 6.9},
    { symbol: 'SDR', name: 'Schroders', eventDate: '2023-07-15', price: 6.63},
    { symbol: 'SL', name: 'Standard Life', eventDate: '2023-06-15', price: 6.63},
    { symbol: 'PSON', name: 'Pearson PLC', eventDate: '2023-07-30', price: 6.52},
    { symbol: 'BNZL', name: 'Bunzl', eventDate: '2023-08-05', price: 6.38},
    { symbol: 'MNDI', name: 'Mondi', eventDate: '2023-02-15', price: 6.37},
    { symbol: 'UU', name: 'United Utilities', eventDate: '2023-03-12', price: 6.36},
    { symbol: 'PSN', name: 'Persimmon plc', eventDate: '2023-04-03', price: 6.34},
    { symbol: 'SGE', name: 'Sage Group', eventDate: '2023-07-15', price: 6.26},
    { symbol: 'EZJ', name: 'EasyJet', eventDate: '2023-05-15', price: 6.17},
    { symbol: 'AAL', name: 'Anglo American plc', eventDate: '2023-02-16', price: 6.09},
    { symbol: 'TW.', name: 'Taylor Wimpey', eventDate: '2023-11-03', price: 5.99},
    { symbol: 'TUI', name: 'TUI Group', eventDate: '2023-11-02', price: 5.99},
    { symbol: 'WPG', name: 'Worldpay', eventDate: '2023-01-02', price: 5.9},
    { symbol: 'RRS', name: 'Randgold Resources', eventDate: '2023-03-04', price: 5.89},
    { symbol: 'HL', name: 'Hargreaves Lansdown', eventDate: '2023-08-07', price: 5.87},
    { symbol: 'BDEV', name: 'Barratt Developments', eventDate: '2023-08-01', price: 5.86},
    { symbol: 'IHG', name: 'InterContinental Hotels Group', eventDate: '2023-11-05', price: 5.75},
    { symbol: 'BRBY', name: 'Burberry', eventDate: '2023-05-15', price: 5.65},
    { symbol: 'DC.', name: 'Dixons Carphone', eventDate: '2023-11-09', price: 5.16},
    { symbol: 'DLG', name: 'Direct Line Group', eventDate: '2023-04-03', price: 5.15},
    { symbol: 'CCH', name: 'Coca-Cola HBC AG', eventDate: '2023-06-05', price: 5.1},
    { symbol: 'SVT', name: 'Severn Trent', eventDate: '2023-07-18', price: 5.04},
    { symbol: 'DCC', name: 'DCC plc', eventDate: '2023-01-17', price: 5.03},
    { symbol: 'SBRY', name: 'Sainsbury\'s', eventDate: '2023-03-18', price: 5.02},
    { symbol: 'ADM', name: 'Admiral Group', eventDate: '2023-04-01', price: 4.91},
    { symbol: 'GKN', name: 'GKN', eventDate: '2023-07-15', price: 4.79},
    { symbol: 'JMAT', name: 'Johnson Matthey', eventDate: '2023-09-27', price: 4.79},
    { symbol: 'PFG', name: 'Provident Financial', eventDate: '2023-02-26', price: 4.74},
    { symbol: 'ANTO', name: 'Antofagasta', eventDate: '2023-11-19', price: 4.71},
    { symbol: 'STJ', name: 'St. James\'s Place plc', eventDate: '2023-02-04', price: 4.68},
    { symbol: 'ITRK', name: 'Intertek', eventDate: '2023-05-30', price: 4.67},
    { symbol: 'BAB', name: 'Babcock International', eventDate: '2023-08-21', price: 4.65},
    { symbol: 'BKG', name: 'Berkeley Group Holdings', eventDate: '2023-02-11', price: 4.6},
    { symbol: 'ISAT', name: 'Inmarsat', eventDate: '2023-01-15', price: 4.47},
    { symbol: 'TPK', name: 'Travis Perkins', eventDate: '2023-07-20', price: 4.46},
    { symbol: 'HMSO', name: 'Hammerson', eventDate: '2023-03-04', price: 4.42},
    { symbol: 'MERL', name: 'Merlin Entertainments', eventDate: '2023-03-12', price: 4.42},
    { symbol: 'RMG', name: 'Royal Mail', eventDate: '2023-06-21', price: 4.41},
    { symbol: 'AHT', name: 'Ashtead Group', eventDate: '2023-06-30', price: 4.26},
    { symbol: 'RSA', name: 'RSA Insurance Group', eventDate: '2023-11-12', price: 4.16},
    { symbol: 'III', name: '3i', eventDate: '2023-03-23', price: 4.06},
    { symbol: 'INTU', name: 'Intu Properties', eventDate: '2023-05-29', price: 3.89},
    { symbol: 'SMIN', name: 'Smiths Group', eventDate: '2023-04-23', price: 3.84},
    { symbol: 'HIK', name: 'Hikma Pharmaceuticals', eventDate: '2023-01-01', price: 3.71},
    { symbol: 'ADN', name: 'Aberdeen Asset Management', eventDate: '2023-09-09', price: 3.14},
    { symbol: 'SPD', name: 'Sports Direct', eventDate: '2023-03-12', price: 2.4}
  ];

  let data = [];
  pricingData.forEach((e) => {
    let price = _randBetween(1, 100000) / 100, priceHistory = price + _randBetween(0, 100) / 100;
    data.push({
      symbol: e.symbol,
      name: e.name,
      eventDate: e.eventDate,
      marketPrice: price,
      chart: price,
      priceHistory: [priceHistory, priceHistory],
    });
  });

  return data;
};

// get a random number within a given interval
const _randBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// API endpoint to fetch pricing data
app.get('/api/pricing', (req, res) => {
  res.json(getData()); // Return pricing data as JSON
});

const PORT = process.env.PORT || 5000; // Set the port number
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
