import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import { useState, useContext } from 'react';
import AppContext from './context';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Row,
  Col,
  InputGroup,
  Input,
  Container,
  Spinner,
} from 'reactstrap';
function Dishes({ restId }) {
  const [restaurantID, setRestaurantID] = useState();
  const [query, setQuery] = useState('');
  const { addItem } = useContext(AppContext);

  const GET_RESTAURANT_DISHES = gql`
    query ($id: ID!) {
      restaurant(id: $id) {
        id
        name
        dishes {
          id
          name
          description
          price
          image {
            url
          }
        }
      }
    }
  `;

  const router = useRouter();

  const { loading, error, data } = useQuery(GET_RESTAURANT_DISHES, {
    variables: { id: restId },
  });

  if (loading)
    return (
      <Button variant="primary" disabled>
        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
        <span className="visually-hidden">Poo...</span>
      </Button>
    );
  if (error) return <p></p>;
  if (!data) return <p>Not found</p>;

  let restaurant = data.restaurant;

  if (restId) {
    const dishes = restaurant.dishes.filter((res) => {
      return res.name.toLowerCase().includes(query);
    });
    return (
      <>
        <Container>
          <Row>
            <Col xs={12}>
              <InputGroup>
                <Input
                  autoFocus
                  placeholder={`Search your favorite dish in "${restaurant.name}"`}
                  onChange={(e) => setQuery(e.target.value.toLocaleLowerCase())}
                  value={query}
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            {dishes.map((res) => (
              <Col xs="6" sm="3" style={{ padding: 0 }} key={res.id}>
                <Card style={{ margin: '0 10px' }}>
                  <CardImg top={true} style={{ width: ' auto' }} src={res?.image?.url} />
                  <CardBody>
                    <CardTitle>
                      <h3>{res.name}</h3>
                    </CardTitle>
                    <CardText>{res.description}</CardText>
                  </CardBody>
                  <div className="card-footer">
                    <Button color="info" color="primary" outline onClick={() => addItem(res)}>
                      + Add To Cart
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </>
    );
  } else {
    return <h1> No Dishes</h1>;
  }
}
export default Dishes;
