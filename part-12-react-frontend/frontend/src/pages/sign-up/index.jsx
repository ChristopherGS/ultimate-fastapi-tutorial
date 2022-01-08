import React, { useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PublicHeader from "../../components/PublicHeader";
import PublicFooter from "../../components/PublicFooter";
import './index.scss';
import CourseMakerClient from '../../client';
import config from '../../config';
import { Helmet } from "react-helmet";
import { getPageTitle } from '../../helpers/constants';
import {useSnackbar} from "notistack";
import logo from "../../logo.svg";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

const client = new CourseMakerClient(config);

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [error, setError] = useState(false);
  const [errorCode, setErrorCode] = useState(false);
  const [errorMinLegth, setErrorMinLegth] = useState(false);
  const [loginForm, setLoginForm] = useState({ full_name: '', email: '', password: '', code: '', accept: false });

  const onLogin = (e) => {
    e.preventDefault();
    if(loginForm.password.length < 8) {
      return setErrorMinLegth(true)
    }
    setErrorMinLegth(false);
    setErrorCode(false);
    setError(false);
    client.register(loginForm.email, loginForm.password, loginForm.full_name)
      .then(() => {
        client.login(loginForm.email, loginForm.password)
          .then( () => {
            history.push('/dashboard')
          })
      })
      .catch( (err) => {
        // usually email address taken
        enqueueSnackbar(err.response.data.detail, { variant: 'error', autoHideDuration: 10000 });
        setError(true);
      });
  }
	return (
    <>
      <Helmet>
        <title>{getPageTitle('signUp')}</title>
      </Helmet>
      <PublicHeader />

      <main>
        <section className="py-16 bg-indigo-100 md:py-24">
          <div className="container">
            <div className="login-title">Please Create an Account</div>
            <p className="login-subtitle">14 Day Free Trial (no credit card required)</p>
            <Form className="login-form bg-white rounded-lg shadow-lg" onSubmit={onLogin}>
              <Form.Group>
                <Form.Label>Full name</Form.Label>
                <Form.Control placeholder="Enter full name" value={loginForm.full_name} onChange={(e) => setLoginForm({...loginForm, full_name: e.target.value })}/>
              </Form.Group>
              <Form.Group>
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={loginForm.email} onChange={(e) => setLoginForm({...loginForm, email: e.target.value })}/>
              </Form.Group>

              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value })}/>
              </Form.Group>
              <Form.Group>
                <Form.Check type="checkbox" checked={loginForm.accept} onChange={(e) => setLoginForm({...loginForm, accept: e.target.checked })}  label={<>Agree to <a rel="noopener noreferrer" target="_blank" href="https://coursemaker.org/terms/">terms and conditions</a> & subscribe to reasonable email updates (you can unsubscribe anytime)</>} />
              </Form.Group>
              {error && <div className="err-mess-login">Sign up failed. Please try again</div>}
              {errorCode && <div className="err-mess-login">Please enter valid beta code</div>}
              {errorMinLegth && <div className="err-mess-login">Password min length is 8 characters</div>}
              <Button disabled={!loginForm.accept || !loginForm.full_name || !loginForm.email || !loginForm.password || !loginForm.password} className="full-width mt-10" size="lg" variant="medium-green" type="submit">
                Sign up
              </Button>
            </Form>
            <div className="no-account text-center">
              <span>Already have an account? </span>
              <Link className="sign-up-text" to="/login">Log In</Link>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
	);
};

export default Login;
