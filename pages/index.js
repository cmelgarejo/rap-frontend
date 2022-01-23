import React, { useContext, useState } from 'react';
import Cart from '../components/cart';
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import RestaurantList from '../components/restaurantList';
import { InputGroup, Input, InputGroupAddon, Container, Row, Col } from 'reactstrap';
import AppContext from '../components/context';

function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
  const { isAuthenticated } = useContext(AppContext);
  const [query, setQuery] = useState('');
  const link = new HttpLink({ uri: `${API_URL}/graphql` });
  const cache = new InMemoryCache();
  const client = new ApolloClient({ link, cache });

  return (
    <ApolloProvider client={client}>
      <Container>
        <Row style={{ paddingTop: 10 }}>
          <Col>
            <InputGroup>
              <Input
                placeholder="Search for a restaurant"
                onChange={(e) => setQuery(e.target.value.toLocaleLowerCase())}
                value={query}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col lg="9" md="8" xs="12">
            <RestaurantList search={query} />
          </Col>
          <Col lg="3" md="4" xs="12">
            <Cart checkout={isAuthenticated} />
          </Col>
        </Row>
      </Container>
    </ApolloProvider>
  );
}
export default Home;
