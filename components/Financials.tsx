
import React from 'react';
import { FinancialRecord } from '../types';

const mockFinancials: FinancialRecord[] = [
  { id: 'F001', date: '2023-10-26', description: 'Sale S001', type: 'Income', amount: 250.00 },
  { id: 'F002', date: '2023-10-26', description: 'Office Supplies', type: 'Expense', amount: 55.20 },
  { id: 'F003', date: '2023-10-25', description: 'Sale S003', type: 'Income', amount: 500.00 },
  { id: 'F004', date: '2023-10-24', description: 'Cloud Server Hosting', type: 'Expense', amount: 150.00 },
  { id: 'F005', date: '2023-10-24', description: 'Sale S004', type: 'Income', amount: 1200.00 },
];

const Financials: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-dark">Financial Reports</h1>
       <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-dark mb-4">General Ledger</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockFinancials.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.type === 'Income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {record.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                      record.type === 'Income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {record.type === 'Income' ? '+' : '-'}${record.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Financials;
