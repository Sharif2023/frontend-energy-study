import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const PlaceholderWidget = ({ id }) => {
  const { widgetRefreshCounter } = useApp();
  const [number, setNumber] = useState(Math.floor(Math.random() * 1000));
  const [color] = useState(() => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe'];
    return colors[id % colors.length];
  });

  useEffect(() => {
    setNumber(Math.floor(Math.random() * 1000));
  }, [widgetRefreshCounter]);

  return (
    <div className="widget" data-id={id} style={{ borderTop: `4px solid ${color}` }}>
      <h3>Widget {id}</h3>
      <div style={{ fontSize: '32px', fontWeight: 'bold', color }}>
        {number}
      </div>
    </div>
  );
};

export default PlaceholderWidget;
