import React, { useState, useEffect } from 'react';
import { Sale } from '../types';
import ModuleFileUploader from './ModuleFileUploader';

const mockSales: Sale[] = [
  { id: 'S001', product: 'Widget Pro', date: '2023-10-26', amount: 250.00, customer: 'Acme Corp' },
  { id: 'S002', product: 'Gadget Lite', date: '2023-10-26', amount: 75.50, customer: 'Innovate LLC' },
  { id: 'S003', product: 'Widget Pro', date: '2023-10-25', amount: 500.00, customer: 'Global Tech' },
  { id: 'S004', product: 'Service Pack', date: '2023-10-24', amount: 1200.00, customer: 'Acme Corp' },
  { id: 'S005', product: 'Gadget Lite', date: '2023-10-23', amount: 151.00, customer: 'Beta Solutions' },
];

const DataTable: React.FC<{ title: string, headers: string[], data: any[], renderRow: (item: any) => React.ReactNode }> = ({ title, headers, data, renderRow }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-dark mb-4">{title}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map(header => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map(renderRow)}
            </tbody>
          </table>
        </div>
    </div>
);

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('erp-sales');
    if (stored) {
      setSales(JSON.parse(stored));
    } else {
      setSales(mockSales);
    }
  }, []);

  useEffect(() => {
    if (sales.length > 0) {
      localStorage.setItem('erp-sales', JSON.stringify(sales));
    }
  }, [sales]);

  const handleImport = (file: File) => {
    if (file.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        // Simple CSV parser assuming header: Product, Customer, Date, Amount
        const rows = text.split('\n').slice(1);
        const newSales: Sale[] = [];
        
        rows.forEach((row, idx) => {
          if (!row.trim()) return;
          const cols = row.split(',');
          // Provide defaults
          const product = cols[0]?.trim();
          if (product) {
            newSales.push({
              id: `S-IMP-${Date.now()}-${idx}`,
              product: product,
              customer: cols[1]?.trim() || 'Walk-in',
              date: cols[2]?.trim() || new Date().toISOString().split('T')[0],
              amount: parseFloat(cols[3]?.trim()) || 0
            });
          }
        });
        
        if (newSales.length > 0) {
          setSales(prev => [...newSales, ...prev]);
        }
      };
      reader.readAsText(file);
    } else {
        // Excel simulation
        const newSale: Sale = {
            id: `S-XLS-${Date.now()}`,
            product: `Imported Batch from ${file.name}`,
            customer: 'Multiple',
            date: new Date().toISOString().split('T')[0],
            amount: 5000.00 // dummy total
        };
        setSales(prev => [newSale, ...prev]);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-dark">Sales</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-dark mb-4">Import Sales Data</h2>
        <ModuleFileUploader 
            accept=".csv, .xlsx" 
            label="Upload CSV or Excel" 
            onFileSelect={handleImport} 
        />
        <p className="text-sm text-gray-500 mb-4">
            For CSV, use format: <code className="bg-gray-100 px-1 rounded">Product, Customer, Date, Amount</code>
        </p>
      </div>

      <DataTable 
        title="Recent Sales Transactions"
        headers={['ID', 'Product', 'Customer', 'Date', 'Amount']}
        data={sales}
        renderRow={(sale: Sale) => (
            <tr key={sale.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.product}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">${sale.amount.toFixed(2)}</td>
            </tr>
        )}
      />
    </div>
  );
};

export default Sales;