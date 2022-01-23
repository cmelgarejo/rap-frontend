import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, Spinner } from 'reactstrap';
import { login } from '../components/auth';
import AppContext from '../components/context';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
function Login(props) {
  const [data, updateData] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const appContext = useContext(AppContext);

  useEffect(() => {
    if (appContext.isAuthenticated) {
      router.push('/'); // redirect if you're already logged in
    }
  }, [appContext]);

  function onChange(event) {
    updateData({ ...data, [event.target.name]: event.target.value });
  }

  return (
    <Container>
      <Row>
        <Col xs={12} md={{ size: 6, offset: 3 }}>
          <div className="paper">
            <div className="header">
              <img src="/raplogo.png" style={{ width: '100px', backgroundColor: 'white' }} />
            </div>
            <section className="wrapper">
              {Object.entries(error).length !== 0 &&
                error.constructor === Object &&
                error.message.map((error) => {
                  return (
                    <div key={error.messages[0].id} style={{ marginBottom: 10 }}>
                      <small style={{ color: 'red' }}>{error.messages[0].message}</small>
                    </div>
                  );
                })}
              <Form>
                <fieldset disabled={loading}>
                  <FormGroup>
                    <Label>Email:</Label>
                    <Input
                      onChange={(event) => onChange(event)}
                      name="identifier"
                      style={{ height: 50, fontSize: '1.2em' }}
                    />
                  </FormGroup>
                  <FormGroup style={{ marginBottom: 30 }}>
                    <Label>Password:</Label>
                    <Input
                      onChange={(event) => onChange(event)}
                      type="password"
                      name="password"
                      style={{ height: 50, fontSize: '1.2em' }}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Container>
                      <Row>
                        <Col xs={12} md={6}>
                          <Button
                            style={{ float: 'right', width: 120 }}
                            color="primary"
                            onClick={() => {
                              setLoading(true);
                              login(data.identifier, data.password)
                                .then((res) => {
                                  setLoading(false);
                                  // set authed User in global context to update header/app state
                                  appContext.setUser(res.data.user);
                                })
                                .catch((error) => {
                                  setError(error.response.data);
                                  setLoading(false);
                                });
                            }}
                          >
                            {loading ? (
                              <Button variant="primary" disabled>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                <span className="visually-hidden">Poo...</span>
                              </Button>
                            ) : (
                              'Submit'
                            )}
                          </Button>
                        </Col>
                        <Col xs={12} md={6}>
                          <Link href={`${API_URL}/connect/google`}>
                            <Button color="primary" outline className="btn-google">
                              <img
                                className="google-icon"
                                alt="Google sign-in"
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                              />
                              Sign in with Google
                            </Button>
                          </Link>
                        </Col>
                      </Row>
                    </Container>
                  </FormGroup>
                </fieldset>
              </Form>
            </section>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
