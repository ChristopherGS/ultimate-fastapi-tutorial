import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import './index.scss';

function DashboardHeader() {
  return (
    <Navbar className="dashboard-footer">
      <div>
        <Navbar.Brand className="mr-auto">
          <Link to='/dashboard'>
            <img src="/img/logo_colour.png" alt="Course Maker"/>
          </Link>
        </Navbar.Brand>
        <Nav>
          <a href="https://coursemaker.org/terms/" target="_blank" className="nav-link">Terms</a>
          <a href="https://coursemaker.org/privacy-policy/" target="_blank" className="nav-link">Privacy</a>
          <a href="https://coursemaker.org/contact/" target="_blank" className="nav-link">Contact</a>
        </Nav>
      </div>
    </Navbar>
  );
}

export default DashboardHeader;
