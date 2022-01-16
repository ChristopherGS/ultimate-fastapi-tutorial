import React from 'react';
import { useNavigate } from 'react-router-dom'
import Login from '../login'
import { Link } from 'react-router-dom';
import CourseMakerClient from '../../client';
import config from '../../config';
import { useEffect } from 'react';
import logo from "../../logo.svg";

const client = new CourseMakerClient(config);

class TableView extends React.Component {
  renderTableData() {
    return this.props.courses.map((course, index) => {
      const { id, title, description, _status } = course
      return (
        <tr key={id}>
        <td>{id}</td>
        <td><Link to={`/courses/${id}`} >{title}</Link></td>
        <td>{description}</td>
        <td>{_status}</td>
        </tr>
      )
    })
  }
  render() {
    return (
      <table className="tableView">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {this.renderTableData()}
        </tbody>
      </table>
    );
  }
}

class CourseCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let state = {};
    state[event.target.name] = event.target.value;
    this.setState(state);
  }

  handleSubmit(event) {
    client.createCourse(this.state)
      .then(() => {
      });
    event.preventDefault();
  }

  render() {
    return (
      <>
      <h2> New Course </h2>
      <form className="courseCreator" onSubmit={this.handleSubmit}>
        <div>
        <label><b>Name</b></label>
        <input type="text" placeholder="Course Title" name="title" value={this.state.username} onChange={this.handleChange} required/>
        </div>

        <div>
        <label><b>Description</b></label>
        <input type="text" placeholder="Course Description" name="description" value={this.state.password} onChange={this.handleChange} required />
        </div>

        <div>
        <button type="submit">Submit</button>
        <label>
          <input type="checkbox" checked="checked" name="_status" onChange={this.handleChange} />
          Create as draft:
        </label>
        </div>
      </form>
      </>
    )
  }
}


class CreateCourse extends React.Component {
  constructor() {
    super();

    this.goToCourseCreator = this.goToCourseCreator.bind(this)
  }

  goToCourseCreator() {
    this.props.tabSwitchHandler("CourseCreator");
  }

  render() {
    return (
      <div className="createCourse">
        <button onClick={this.goToCourseCreator}>Create New Course </button>
      </div>
    )
  }
}

class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      dataReady: false,
      courses: null
    }

    this.fetchRecipes = this.fetchRecipes.bind(this);
  }

  fetchRecipes() {
    return [
        {
          "label": "Chicken Vesuvio",
          "source": "Serious Eats",
          "url": "http://www.seriouseats.com/recipes/2011/12/chicken-vesuvio-recipe.html",
          "id": 1,
          "submitter_id": 1
        }
    ]
  }

  render() {
    return (
        <CourseCreator
            fetchCourses={this.fetchCourses}
        />
    )
  }
}


class Home extends React.Component {
  constructor() {
    super();
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      this.setState({
        loggedIn: true
      });
    }
  }

  handleLogout() {
    client.logout();
    this.setState({
      loggedIn: false
    });
  }

  handleLogin(username, password) {
    client.login(username, password)
      .then( () => {
        this.setState({
          loggedIn: true
        });
      })
      .catch( (err) => {
        console.log(err);
        alert("Login failed.")
      });
  }
  handleRegister(username, password, fullName) {
    client.register(username, password, fullName)
      .then( () => {
        alert("Register done. Please login")
        window.location.reload();
      })
      .catch( (err) => {
        console.log(err);
        alert("Register failed.")
      });
  }

  render() {
    return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1> Course Maker </h1>
      </header>
      <div className="mainViewport">
        <MainView
          loginHandler={this.handleLogin}
          registerHandler={this.handleRegister}
          logoutHandler={this.handleLogout}
          loggedIn={this.state.loggedIn}
        />
      </div>
    </div>
  );
  }
}

export default Home;


export const HomeRedirector = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard')
    } else {
      navigate('/login');
    }
  }, [navigate]);
  return null;
}