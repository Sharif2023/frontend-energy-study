import { useApp } from '../context/AppContext';

const StatsPanel = ({ itemCount }) => {
  const { widgetRefreshCounter, pageLoads } = useApp();

  return (
    <div className="stats">
      <span>Total Items: <span id="item-count">{itemCount}</span></span>
      <span>Widgets Active: 25</span>
      <span>Widget Refreshes: <span id="widget-refresh-count">{widgetRefreshCounter}</span></span>
      <span>Page Loads: <span id="page-count">{pageLoads}</span></span>
    </div>
  );
};

export default StatsPanel;
