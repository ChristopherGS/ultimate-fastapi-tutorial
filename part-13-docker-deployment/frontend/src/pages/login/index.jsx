import React, {useState} from 'react';
import DashboardHeader from "../../components/DashboardHeader";
import {useNavigate} from "react-router-dom";
import CourseMakerClient from '../../client';
import config from '../../config';

const client = new CourseMakerClient(config);

const Login = () => {
  const [error, setError] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const navigate = useNavigate()

  const onLogin = (e) => {
    e.preventDefault();
    setError(false);
    client.login(loginForm.username, loginForm.password)
      .then( () => {
        navigate('/my-recipes')
      })
      .catch( (err) => {
        setError(true);
      });
  }

  return (
      <>
      <section className="bg-black ">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
            <h3 className="text-2xl font-bold text-center">Login to your account</h3>
            <form onSubmit={(e) => onLogin(e)}>
              <div className="mt-4">
                <div>
                  <label className="block" htmlFor="email">Email</label>
                    <input type="text" placeholder="Email" value={loginForm.username} onChange={(e) => setLoginForm({...loginForm, username: e.target.value })}
                           className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600">
                    </input>
                </div>
                <div className="mt-4">
                  <label className="block">Password</label>
                    <input type="password" placeholder="Password" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value })}
                           className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600">
                    </input>
                </div>
                <div className="flex items-baseline justify-between">
                  <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Login</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default Login;


