
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SalesIcon, InventoryIcon, FinancialsIcon } from './icons';

const salesData = [
  { name: 'Jan', Sales: 4000 },
  { name: 'Feb', Sales: 3000 },
  { name: 'Mar', Sales: 5000 },
  { name: 'Apr', Sales: 4500 },
  { name: 'May', Sales: 6000 },
  { name: 'Jun', Sales: 5500 },
];

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-primary/10 text-primary p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-medium">{title}</p>
      <p className="text-2xl font-bold text-dark">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-dark">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Sales (This Month)" value="$12,500" icon={<SalesIcon className="w-6 h-6"/>} />
        <StatCard title="Inventory Items" value="1,240" icon={<InventoryIcon className="w-6 h-6"/>} />
        <StatCard title="Net Profit" value="$4,800" icon={<FinancialsIcon className="w-6 h-6"/>} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-dark mb-4">Monthly Sales Performance</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip wrapperClassName="rounded-md border-gray-200 shadow-sm" />
              <Legend />
              <Bar dataKey="Sales" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
