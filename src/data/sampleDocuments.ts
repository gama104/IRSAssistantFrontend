import { IRSDocument } from '@/types';

export const sampleDocuments: Omit<IRSDocument, 'id' | 'uploadDate'>[] = [
  {
    name: 'W-2 Form 2023.pdf',
    year: 2023,
    type: 'W-2',
    status: 'ready',
    fileSize: 245760,
  },
  {
    name: 'W-2 Form 2022.pdf',
    year: 2022,
    type: 'W-2',
    status: 'ready',
    fileSize: 198432,
  },
  {
    name: '1099-INT 2023.pdf',
    year: 2023,
    type: '1099',
    status: 'ready',
    fileSize: 156789,
  },
  {
    name: 'Form 1040 2023.pdf',
    year: 2023,
    type: '1040',
    status: 'processing',
    fileSize: 512000,
  },
];
