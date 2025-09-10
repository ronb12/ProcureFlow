import * as csvWriter from 'csv-writer';
import JSZip from 'jszip';
import { getStorage } from 'firebase-admin/storage';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';

export interface ExportData {
  requestId: string;
  vendor: string;
  orderNumber: string;
  finalTotal: number;
  tax: number;
  accountingCode: string;
  purchasedAt: Date;
  receiptUrl?: string;
}

export async function createCSV(data: ExportData[]): Promise<string> {
  const writer = csvWriter.createObjectCsvWriter({
    path: '/tmp/export.csv',
    header: [
      { id: 'requestId', title: 'Request ID' },
      { id: 'vendor', title: 'Vendor' },
      { id: 'orderNumber', title: 'Order Number' },
      { id: 'finalTotal', title: 'Final Total' },
      { id: 'tax', title: 'Tax' },
      { id: 'accountingCode', title: 'Accounting Code' },
      { id: 'purchasedAt', title: 'Purchased At' },
      { id: 'receiptUrl', title: 'Receipt URL' },
    ],
  });

  await writer.writeRecords(data);

  // Read the file content
  const fs = require('fs');
  return fs.readFileSync('/tmp/export.csv', 'utf8');
}

export async function createReceiptsZip(
  purchases: QueryDocumentSnapshot[]
): Promise<Buffer> {
  const zip = new JSZip();
  const storage = getStorage();
  const bucket = storage.bucket();

  for (const purchaseDoc of purchases) {
    const purchase = purchaseDoc.data();

    if (!purchase.receiptUrl) continue;

    try {
      // Download receipt from storage
      const fileName =
        purchase.receiptFileName || `receipt_${purchaseDoc.id}.pdf`;
      const file = bucket.file(
        purchase.receiptUrl.replace('gs://', '').split('/').slice(1).join('/')
      );

      const [fileBuffer] = await file.download();

      // Add to ZIP
      zip.file(fileName, fileBuffer);
    } catch (error) {
      console.error(`Error adding receipt ${purchaseDoc.id} to ZIP:`, error);
    }
  }

  return zip.generateAsync({ type: 'nodebuffer' });
}
