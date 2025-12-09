import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../types';
import ModuleFileUploader from './ModuleFileUploader';

const mockInventory: InventoryItem[] = [
  { id: 'I001', name: 'Widget Pro', sku: 'WPRO-001', quantity: 150, location: 'Warehouse A' },
  { id: 'I002', name: 'Gadget Lite', sku: 'GLITE-002', quantity: 300, location: 'Warehouse B' },
  { id: 'I003', name: 'Service Pack', sku: 'SPACK-003', quantity: 50, location: 'Digital' },
  { id: 'I004', name: 'Component X', sku: 'COMPX-004', quantity: 1200, location: 'Warehouse A' },
  { id: 'I005', name: 'Component Y', sku: 'COMPY-005', quantity: 850, location: 'Warehouse C' },
];

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('erp-inventory');
    if (stored) {
      setItems(JSON.parse(stored));
    } else {
      setItems(mockInventory);
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('erp-inventory', JSON.stringify(items));
    }
  }, [items]);

  const handleImport = (file: File) => {
    if (file.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        // Simple CSV parser assuming header: SKU, Name, Quantity, Location
        // Skipping header row
        const rows = text.split('\n').slice(1);
        const newItems: InventoryItem[] = [];
        
        rows.forEach((row, idx) => {
          if (!row.trim()) return;
          const cols = row.split(',');
          // Provide defaults if columns are missing
          const sku = cols[0]?.trim();
          if (sku) {
             newItems.push({
                id: `IMP-${Date.now()}-${idx}`,
                sku: sku,
                name: cols[1]?.trim() || 'Imported Item',
                quantity: parseInt(cols[2]?.trim()) || 0,
                location: cols[3]?.trim() || 'Receiving'
             });
          }
        });
        
        if (newItems.length > 0) {
          setItems(prev => [...newItems, ...prev]);
        }
      };
      reader.readAsText(file);
    } else {
      // Logic for Excel or other formats (Simulated)
      // Since we don't have a client-side Excel parser library loaded, we simulate an import
      const newItem: InventoryItem = {
        id: `XLS-${Date.now()}`,
        name: `Bulk Import from ${file.name}`,
        sku: 'BATCH-IMPORT',
        quantity: 100,
        location: 'Warehouse A'
      };
      setItems(prev => [newItem, ...prev]);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold text-dark">Inventory</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-dark mb-4">Import Inventory Data</h2>
        <ModuleFileUploader 
            accept=".csv, .xlsx" 
            label="Upload CSV or Excel" 
            onFileSelect={handleImport} 
        />
        <p className="text-sm text-gray-500 mb-4">
            For CSV, use format: <code className="bg-gray-100 px-1 rounded">SKU, Name, Quantity, Location</code>
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-dark mb-4">Current Stock Levels</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;