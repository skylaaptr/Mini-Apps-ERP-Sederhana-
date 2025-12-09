
import React, { useState } from 'react';
import useAuth from './hooks/useAuth';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Sales from './components/Sales';
import Inventory from './components/Inventory';
import Financials from './components/Financials';
import Documents from './components/Documents';

const App: React.FC = () => {
  const { user, login, logout, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('Dashboard');

  const renderContent = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Sales':
        return <Sales />;
      case 'Inventory':
        return <Inventory />;
      case 'Financials':
        return <Financials />;
      case 'Documents':
        return <Documents user={user} />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Login onLogin={login} />;
  }

  return (
    <Layout user={user} onLogout={logout} currentPage={currentPage} onNavClick={setCurrentPage}>
      {renderContent()}
    </Layout>
  );
};

export default App;
