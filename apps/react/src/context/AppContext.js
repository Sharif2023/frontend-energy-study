import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [itemCounter, setItemCounter] = useState(0);
  const [widgetRefreshCounter, setWidgetRefreshCounter] = useState(0);
  const [pageLoads, setPageLoads] = useState(0);

  const incrementItemCounter = (amount) => {
    setItemCounter(prev => prev + amount);
  };

  const decrementItemCounter = (amount) => {
    setItemCounter(prev => Math.max(0, prev - amount));
  };

  const refreshWidgets = () => {
    setWidgetRefreshCounter(prev => prev + 1);
  };

  const incrementPageLoads = () => {
    setPageLoads(prev => prev + 1);
  };

  return (
    <AppContext.Provider value={{
      itemCounter,
      widgetRefreshCounter,
      pageLoads,
      incrementItemCounter,
      decrementItemCounter,
      refreshWidgets,
      incrementPageLoads
    }}>
      {children}
    </AppContext.Provider>
  );
};
