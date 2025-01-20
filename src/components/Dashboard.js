import React from 'react';
import { ProgressChart } from './ProgressChart';
import { QuoteGenerator } from './QuoteGenerator';

const Dashboard = ({ goals }) => {
  return (
    <div>
      <h1>Dashboard</h1>
      <ProgressChart goals={goals} />
      <QuoteGenerator />
    </div>
  );
};

export default Dashboard;
