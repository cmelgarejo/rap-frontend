import React, { useContext } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Container, Nav, NavItem } from 'reactstrap';
import AppContext from './context';

const Layout = (props) => {
  const title = 'Welcome! - RAP - Restaurant App Project';
  const { user, setUser, logout } = useContext(AppContext);
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" type="image/png" href="favicon.png" />
      </Head>
      <header>
        <Nav className="navbar navbar-dark bg-dark">
          <NavItem>
            <Link href="/">
              <img src="/raplogo.png" style={{ width: 100, backgroundColor: 'white' }} />
            </Link>
          </NavItem>
          <NavItem className="ml-auto">
            {user ? (
              <h4>What are we going to eat now, <strong>{user.username}</strong>?</h4>
            ) : (
              <Link href="/register">
                <a className="nav-link">Sign up</a>
              </Link>
            )}
          </NavItem>
          <NavItem>
            {user ? (
              <Link href="/">
                <a
                  className="nav-link"
                  onClick={() => {
                    logout();
                    setUser(null);
                  }}
                >
                  Logout
                </a>
              </Link>
            ) : (
              <Link href="/login">
                <a className="nav-link">Sign in</a>
              </Link>
            )}
          </NavItem>
        </Nav>
      </header>
      <Container className="main-container">{props.children}</Container>
    </div>
  );
};

export default Layout;
