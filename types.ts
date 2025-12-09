
export interface User {
  username: string;
}

export interface DocumentFile {
  id: string;
  nama_file: string;
  tipe_file: string;
  ukuran: number;
  tanggal_upload: string;
  diupload_oleh: string;
  url: string; // Object URL for client-side download
}

export interface Sale {
  id: string;
  product: string;
  date: string;
  amount: number;
  customer: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  location: string;
}

export interface FinancialRecord {
  id: string;
  date: string;
  description: string;
  type: 'Income' | 'Expense';
  amount: number;
}
