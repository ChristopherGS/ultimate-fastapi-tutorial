import React, {useState} from 'react';
import DashboardHeader from "../../components/DashboardHeader";
import {useNavigate} from "react-router-dom";
import CourseMakerClient from '../../client';
import config from '../../config';

const client = new CourseMakerClient(config);

const SignUp = () => {
  const [error, setError] = useState(false);
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', fullName: '' });
  const navigate = useNavigate()

  const onRegister = (e) => {
    e.preventDefault();
    setError(false);
    if ( !registerForm.email || !registerForm.password || !registerForm.fullName ) {
      alert('Please fill out all form fields')
    }
    client.register(registerForm.email, registerForm.password, registerForm.fullName)
      .then( () => {
        navigate('/my-recipes')
      })
      .catch( (err) => {
        setError(true);
        alert(err)
      });
  }

  return (
      <>
      <section className="bg-black ">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
            <h3 className="text-2xl font-bold text-center">Create your account</h3>
            <form action="">
              <div className="mt-4">
                <div>
                  <label className="block" htmlFor="email">Email</label>
                    <input type="text" placeholder="Email" value={registerForm.email} onChange={(e) => setRegisterForm({...registerForm, email: e.target.value })}
                           className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600">
                    </input>
                </div>
                <div className="mt-4">
                  <label className="block">Full Name</label>
                    <input type="text" placeholder="name" value={registerForm.fullName} onChange={(e) => setRegisterForm({...registerForm, fullName: e.target.value })}
                           className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600">
                    </input>
                </div>
                <div className="mt-4">
                  <label className="block">Password</label>
                    <input type="password" placeholder="Password" value={registerForm.password} onChange={(e) => setRegisterForm({...registerForm, password: e.target.value })}
                           className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600">
                    </input>
                </div>
                <div className="flex items-baseline justify-between">
                  <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900" onClick={(e) => onRegister(e)}>Sign Up</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default SignUp;


