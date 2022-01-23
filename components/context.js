import React from 'react';

const AppContext = React.createContext({
  isAuthenticated: false,
  cart: { items: [], total: 0 },
  addItem: () => {},
  removeItem: () => {},
  user: null,
  setCart: () => {},
  setUser: () => {},
  logout: () => {},
});
export default AppContext;
