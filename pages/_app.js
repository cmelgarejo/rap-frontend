import { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import AppContext from '../components/context';
import Home from './index';
import Layout from '../components/layout';
import Cookie from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/index.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { logout } from '../components/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

function MyApp(props) {
  var { cart, addItem, removeItem, user, setUser, isAuthenticated } = useContext(AppContext);
  const [state, setState] = useState({ cart: cart, user: user, isAuthenticated: isAuthenticated });
  const { Component, pageProps } = props;

  setUser = (user) => {
    setState({ ...state, user });
  };
  addItem = (item) => {
    let { items } = state.cart;
    //check for item already in cart
    //if not in cart, add item if item is found increase quanity ++
    let foundItem = true;
    if (items.length > 0) {
      foundItem = items.find((i) => i.id === item.id);

      if (!foundItem) foundItem = false;
    } else {
      foundItem = false;
    }
    // console.info(`Found Item value: ${JSON.stringify(foundItem)}`);
    // if item is not new, add to cart, set quantity to 1
    if (!foundItem) {
      //set quantity property to 1

      let temp = JSON.parse(JSON.stringify(item));
      temp.quantity = 1;
      var newCart = {
        items: [...state.cart.items, temp],
        total: state.cart.total + item.price,
      };
      setState({ ...state, cart: newCart });
      console.info(`Total items: ${JSON.stringify(newCart)}`);
    } else {
      // we already have it so just increase quantity ++
      console.info(`Total so far:  ${state.cart.total}`);
      newCart = {
        items: items.map((item) => {
          if (item.id === foundItem.id) {
            return Object.assign({}, item, { quantity: item.quantity + 1 });
          } else {
            return item;
          }
        }),
        total: state.cart.total + item.price,
      };
    }
    setState({ ...state, cart: newCart });
    console.info(`state reset to cart:${JSON.stringify(state)}`);
  };
  removeItem = (item) => {
    let { items } = state.cart;
    //check for item already in cart
    const foundItem = items.find((i) => i.id === item.id);
    if (foundItem.quantity > 1) {
      var newCart = {
        items: items.map((item) => {
          if (item.id === foundItem.id) {
            return Object.assign({}, item, { quantity: item.quantity - 1 });
          } else {
            return item;
          }
        }),
        total: state.cart.total - item.price,
      };
      //console.info(`NewCart after remove: ${JSON.stringify(newCart)}`)
    } else {
      // only 1 in the cart so remove the whole item
      console.info(`Try remove item ${JSON.stringify(foundItem)}`);
      const index = items.findIndex((i) => i.id === foundItem.id);
      items.splice(index, 1);
      var newCart = { items: items, total: state.cart.total - item.price };
    }
    setState({ ...state, cart: newCart });
  };
  logout: () => {
    Cookies.remove('token');
    setUser(null);
    setState({ ...state, user: null, isAuthenticated: false });
  };
  useEffect(async () => {
    const userToken = Cookies.get('token');
    if (userToken) {
      const res = await axios.get(`${API_URL}/users/me`, { headers: { Authorization: `Bearer ${userToken}` } });
      console.log(res);
      setUser(res.data);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        cart: state.cart,
        addItem: addItem,
        removeItem: removeItem,
        isAuthenticated: false,
        user: state.user,
        setUser: setUser,
        logout: logout,
      }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContext.Provider>
  );
}

export default MyApp;
