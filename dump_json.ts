import { DIVISIONS, MOCK_PRODUCTS, MOCK_BRANDS } from './src/lib/constants';
import * as fs from 'fs';

const data = {
  divisions: DIVISIONS,
  products: MOCK_PRODUCTS,
  brands: MOCK_BRANDS
};

fs.writeFileSync('dump.json', JSON.stringify(data, null, 2));
console.log('Dumped to dump.json');
