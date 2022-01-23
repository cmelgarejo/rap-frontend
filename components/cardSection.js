import React from 'react';

import { CardElement } from '@stripe/react-stripe-js';
import { Button } from 'reactstrap';

function CardSection(props) {
  return (
    <div>
      <div>
        <label htmlFor="card-element">Credit or debit card</label>
        <div>
          <fieldset style={{ border: 'none' }}>
            <div className="form-row">
              <div id="card-element" style={{ width: '100%' }}>
                <CardElement
                  options={{
                    style: { width: '100%', base: { fontSize: '16px' } },
                  }}
                />
              </div>
              <div id="card-errors" role="alert">
                {props.stripeError ? (
                  <div style={{ fontSize: 14, margin: '0.1em', padding: '0.5em' }}>{props.stripeError.toString()}</div>
                ) : null}
              </div>
              <div className="order-button-wrapper ">
                <button className='checkout-button' onClick={props.submitOrder}>Confirm order</button>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}
export default CardSection;
