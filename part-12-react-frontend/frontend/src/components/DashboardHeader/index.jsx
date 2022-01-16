import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import './index.scss';
import CourseMakerClient from '../../client';
import config from '../../config';

const client = new CourseMakerClient(config);

function DashboardHeader() {
  const navigate = useNavigate();

  const logout = () => {
    client.logout();
    navigate('/login');
  }
  return (
    <Navbar className="dashboard-header">
      <Navbar.Brand className="mr-auto">
        <Link to='/dashboard'>
          <img src="/img/logo_colour.png" alt="Course Maker"/>
        </Link>
      </Navbar.Brand>
      <Nav>
        <div className="nav-link" onClick={logout}>Log out</div>
        <div className="avatar">
          <img src="https://picsum.photos/100/100" alt="placeholder"/>
        </div>
      </Nav>
    </Navbar>
  );
}

export default DashboardHeader;
