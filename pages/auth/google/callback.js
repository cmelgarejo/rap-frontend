import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, Spinner } from 'reactstrap';
import { login } from '../../../components/auth';
import AppContext from '../../../components/context';
import Link from 'next/link';
import axios from 'axios';
import Cookie from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

function GoogleCallback(props) {
  const [data, updateData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState(false);
  const router = useRouter();
  const appContext = useContext(AppContext);

  useEffect(async () => {
    if (appContext.isAuthenticated) {
      router.push('/'); // redirect if you're already logged in
    }
    const res = await axios.get(`${API_URL}${router.asPath}`);
    // .then((res) => {
    //set token response from Strapi for server validation
    Cookie.set('token', res.data.jwt);
    appContext.setUser(res.data.user);
    //redirect back to home page for restaurance selection
    router.push('/');
    // }).catch((error) => {
    //   //reject the promise and pass the error object back to the form
    //   console.log(error);
    // });
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <Button variant="primary" disabled>
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            <span className="visually-hidden">Poo...</span>
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default GoogleCallback;
