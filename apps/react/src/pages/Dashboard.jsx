import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import StatsPanel from '../components/StatsPanel';
import ItemList from '../components/ItemList';
import WeatherWidget from '../components/WeatherWidget';
import PlaceholderWidget from '../components/PlaceholderWidget';

const Dashboard = () => {
  const { incrementItemCounter, decrementItemCounter, refreshWidgets, incrementPageLoads } = useApp();
  const [items, setItems] = useState([]);

  useEffect(() => {
    incrementPageLoads();
  }, [incrementPageLoads]);

  const handleAddItems = (amount) => {
    const newItems = Array.from({ length: amount }, (_, i) => ({
      id: Date.now() + i,
      name: `Item ${items.length + i + 1}`
    }));
    setItems(prev => [...prev, ...newItems]);
    incrementItemCounter(amount);
  };

  const handleRemoveItems = (amount) => {
    setItems(prev => {
      const removed = prev.slice(0, amount);
      const remaining = prev.slice(amount);
      decrementItemCounter(removed.length);
      return remaining;
    });
  };

  const handleRefreshWidgets = () => {
    refreshWidgets();
  };

  return (
    <div className="page">
      <StatsPanel itemCount={items.length} />
      
      <div className="controls">
        <button id="refresh-widgets" onClick={handleRefreshWidgets}>
          Refresh Widgets
        </button>
      </div>

      <div className="dashboard" id="widget-grid">
        <WeatherWidget />
        {Array.from({ length: 24 }, (_, i) => (
          <PlaceholderWidget key={i + 2} id={i + 2} />
        ))}
      </div>

      <ItemList items={items} onAddItems={handleAddItems} onRemoveItems={handleRemoveItems} />
    </div>
  );
};

export default Dashboard;
