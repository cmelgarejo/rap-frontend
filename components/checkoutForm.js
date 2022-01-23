import React, { useState, useContext } from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import fetch from 'isomorphic-fetch';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import CardSection from './cardSection';
import AppContext from './context';
import Cookies from 'js-cookie';
import axios from 'axios';

function CheckoutForm() {
  const [data, setData] = useState({
    address: '',
    city: '',
    state: '',
    stripe_id: '',
  });
  const [error, setError] = useState('');
  const stripe = useStripe();
  const elements = useElements();
  const appContext = useContext(AppContext);

  function onChange(e) {
    // set the key = to the name property equal to the value typed
    if (e.target.value) setError('');
    else setError(`Please enter a valid ${[e.target.name]}`);
    const updateItem = (data[e.target.name] = e.target.value);
    // update the state data object
    setData({ ...data, updateItem });
  }

  async function submitOrder() {
    // event.preventDefault();
    if (data.address === '' && data.city === '' && data.state === '' && data.stripe_id === '') {
      setError('Please complete the checkout form before submitting the order');
      return;
    }

    if (appContext.cart.items.length < 1) {
      setError('Please add items to the cart before submitting the order');
      return;
    }
    // // Use elements.getElement to get a reference to the mounted Element.
    const cardElement = elements.getElement(CardElement);

    // // Pass the Element directly to other Stripe.js methods:
    // // e.g. createToken - https://stripe.com/docs/js/tokens_sources/create_token?type=cardElement
    // get token back from stripe to process credit card
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

    const token = await stripe.createToken(cardElement);
    // console.info('stripe token:', token);
    const userToken = Cookies.get('token');
    if (!userToken) {
      setError('You must be logged in to checkout');
      return;
    }
    const response = await axios.post(
      `${API_URL}/orders`,
      {
        amount: Number(Math.round(appContext.cart.total + 'e2') + 'e-2'),
        dishes: appContext.cart.items, //appContext.cart.items.map((item) => item.name),
        address: data.address,
        city: data.city,
        state: data.state,
        token: token.token.id,
      },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );

    if (response.status === 200) {
      setError('Your order has been successfully created!');
      appContext.setCart({
        items: [],
        total: 0,
      });
      cardElement.clear();
    } else setError(response.statusText);

    // OTHER stripe methods you can use depending on app
    // // or createPaymentMethod - https://stripe.com/docs/js/payment_intents/create_payment_method
    // stripe.createPaymentMethod({
    //   type: "card",
    //   card: cardElement,
    // });

    // // or confirmCardPayment - https://stripe.com/docs/js/payment_intents/confirm_card_payment
    // stripe.confirmCardPayment(paymentIntentClientSecret, {
    //   payment_method: {
    //     card: cardElement,
    //   },
    // });
  }

  return (
    <div className="paper checkoutForm">
      <h5>Your information:</h5>
      <hr />
      <FormGroup style={{ display: 'flex' }}>
        <div style={{ flex: '0.90', marginRight: 10 }}>
          <Label>Address</Label>
          <Input name="address" onChange={onChange} />
        </div>
      </FormGroup>
      <FormGroup style={{ display: 'flex' }}>
        <div style={{ flex: '0.65', marginRight: '6%' }}>
          <Label>City</Label>
          <Input name="city" onChange={onChange} />
        </div>
        <div style={{ flex: 0.25, marginRight: 0 }}>
          <Label>State</Label>
          <Input name="state" onChange={onChange} />
        </div>
      </FormGroup>

      <CardSection data={data} stripeError={error} submitOrder={submitOrder} />
    </div>
  );
}
export default CheckoutForm;
