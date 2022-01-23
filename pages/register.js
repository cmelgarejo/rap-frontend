import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { registerUser } from '../components/auth';
import AppContext from '../components/context';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
const Register = () => {
  const [data, setData] = useState({ email: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const router = useRouter();
  const appContext = useContext(AppContext);

  useEffect(() => {
    if (appContext.isAuthenticated) {
      router.push('/'); // redirect if you're already logged in
    }
  }, [appContext]);

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
                    <Label>Username:</Label>
                    <Input
                      disabled={loading}
                      onChange={(e) => setData({ ...data, username: e.target.value })}
                      value={data.username}
                      type="text"
                      name="username"
                      style={{ height: 50, fontSize: '1.2em' }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Email:</Label>
                    <Input
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      value={data.email}
                      type="email"
                      name="email"
                      style={{ height: 50, fontSize: '1.2em' }}
                    />
                  </FormGroup>
                  <FormGroup style={{ marginBottom: 30 }}>
                    <Label>Password:</Label>
                    <Input
                      onChange={(e) => setData({ ...data, password: e.target.value })}
                      value={data.password}
                      type="password"
                      name="password"
                      style={{ height: 50, fontSize: '1.2em' }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Link href={`${API_URL}/connect/google`}>
                      <Button color="primary" outline>
                        <img
                          className="google-icon"
                          alt="Google sign-in"
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                        />
                        Connect with Google
                      </Button>
                    </Link>
                    <Button
                      style={{ float: 'right', width: 120 }}
                      color="primary"
                      disabled={loading}
                      onClick={() => {
                        setLoading(true);
                        registerUser(data.username, data.email, data.password)
                          .then((res) => {
                            // set authed user in global context object
                            appContext.setUser(res.data.user);
                            setLoading(false);
                            // console.info(`registered user: ${JSON.stringify(res.data)}`);
                          })
                          .catch((error) => {
                            console.error(error);
                            setError(error.response.data);
                            setLoading(false);
                          });
                      }}
                    >
                      {loading ? 'Loading..' : 'Submit'}
                    </Button>
                  </FormGroup>
                </fieldset>
              </Form>
            </section>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default Register;
