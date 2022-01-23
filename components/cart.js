import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { Button, Card, CardBody, CardTitle, Badge, Container, Row, Col } from 'reactstrap';
import AppContext from './context';
import Link from 'next/link';
// we can pass cart data in via props method
// the alternative is using useContext as below
function Cart({ checkout }) {
  let { cart, addItem, removeItem, user } = useContext(AppContext);
  //const [cartA, setCartA] = useState({cart})
  //cart = value.cart;
  // console.info('props:'+ JSON.stringify(value));
  // console.info(`in CART: ${JSON.stringify(cart)}`);

  //   problem is that cart may not be set
  const router = useRouter();
  // console.info(`Router Path: ${JSON.stringify(router)}`);
  const renderItems = () => {
    if (cart) {
      let { items } = cart;
      if (items && items.length) {
        // console.info(`items: ${JSON.stringify(items)}`);
        var itemList = cart.items.map((item) => {
          if (item.quantity > 0) {
            return (
              <div className="items-one" style={{ marginBottom: 15 }} key={item.id}>
                <div>
                  <span id="item-price">&nbsp; ${item.price}</span>
                  <span id="item-name">&nbsp; {item.name}</span>
                </div>
                <div>
                  <Button
                    style={{
                      height: 25,
                      padding: 0,
                      width: 15,
                      marginRight: 5,
                      marginLeft: 10,
                    }}
                    onClick={() => addItem(item)}
                    color="link"
                  >
                    +
                  </Button>
                  <Button
                    style={{
                      height: 25,
                      padding: 0,
                      width: 15,
                      marginRight: 10,
                    }}
                    onClick={() => removeItem(item)}
                    color="link"
                  >
                    -
                  </Button>
                  <span style={{ marginLeft: 5 }} id="item-quantity">
                    {item.quantity}x
                  </span>
                </div>
              </div>
            );
          }
        });
        return itemList;
      }
    }
    return <div></div>;
  };
  const checkoutItems = () => {
    if (cart)
      return (
        <div>
          <Badge style={{ width: '100%', padding: 10 }} color="light">
            <h5 style={{ fontWeight: 100, color: 'gray' }}>Total:</h5>
            <h3 style={{ color: 'black' }}>${cart.items.reduce((acc, cur) => (acc += cur.quantity * cur.price), 0)}</h3>
          </Badge>
          {user ? (
            <Link href="/checkout">
              <Button style={{ width: '60%' }} color="primary">
                Checkout
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button style={{ width: '60%' }} color="primary">
                Sign in to get RAP!
              </Button>
            </Link>
          )}
        </div>
      );
    else <div></div>;
  };

  // return Cart
  // console.info(`Router Path: ${router.asPath}`);
  return (
    <Container>
      <Row>
        <Col>
          <h1>Cart</h1>

          {cart.items.length < 1 ? (
            <Container>
              <Row>
                <Col>
                  <h3>Your cart is empty</h3>
                </Col>
              </Row>
              <Row>
                <Col>
                  <img src="/emptycart.png" style={{ width: '100%', backgroundColor: 'white' }} />
                </Col>
              </Row>
            </Container>
          ) : (
            <Card style={{ padding: '10px 5px' }} className="cart">
              <CardTitle style={{ margin: 10 }}>Your Order</CardTitle>
              <hr />
              <CardBody style={{ padding: 10 }}>
                <div style={{ marginBottom: 6 }}>
                  <small>Items:</small>
                </div>
                <div>{renderItems()}</div>
                <div>{checkoutItems()}</div>
              </CardBody>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}
export default Cart;
