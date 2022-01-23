import { gql, useQuery } from '@apollo/client';
import Dishes from './dishes';
import { useContext, useState } from 'react';

import AppContext from './context';
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Container, Row, Col, Spinner } from 'reactstrap';

function RestaurantList(props) {
  const [restaurantID, setRestaurantID] = useState(0);
  const { cart } = useContext(AppContext);
  const [state, setState] = useState(cart);
  const GET_RESTAURANTS = gql`
    query {
      restaurants {
        id
        name
        description
        image {
          url
        }
      }
    }
  `;
  const { loading, error, data } = useQuery(GET_RESTAURANTS);
  if (loading)
    return (
      <Button variant="primary" disabled>
        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
        <span className="visually-hidden">Poo...</span>
      </Button>
    );
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;
  // console.info(`Query Data: `, data.restaurants);

  let searchQuery = data.restaurants.filter((res) => {
    return res.name.toLowerCase().includes(props.search);
  });

  let restId = searchQuery && searchQuery[0] && searchQuery[0].id;

  // definet renderer for Dishes
  const renderDishes = (restaurantID) => {
    return <Dishes restId={restaurantID}> </Dishes>;
  };
  if (searchQuery.length > 0) {
    const restList = searchQuery.map((res) => (
      <Col xs="6" sm="4" key={res.id}>
        <Card style={{ margin: '0 0.5rem 20px 0.5rem' }}>
          <CardImg top={true} style={{ width: '100%' }} src={res.image ? res.image.url : `./raplogo.png`} />
          <CardBody>
            <CardText>{res.description}</CardText>
          </CardBody>
          <div className="card-footer">
            <Button color="info" onClick={() => setRestaurantID(res.id)}>
              {res.name}
            </Button>
          </div>
        </Card>
      </Col>
    ));

    return (
      <Container>
        <Row xs="12">{restList}</Row>
        <Row xs="12">{renderDishes(restaurantID)}</Row>
      </Container>
    );
  } else {
    return <h3> No restaurants found with name "{props.search}"</h3>;
  }
}
export default RestaurantList;
