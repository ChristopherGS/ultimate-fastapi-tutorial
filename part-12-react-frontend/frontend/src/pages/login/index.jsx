import React from 'react';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { fullName: '', username: 'author@example.com', password: 'changethis', rememberMe: false, isLogin: true};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let state = {};
    state[event.target.name] = event.target.value;
    this.setState(state);
  }

  handleSubmit(event) {
    this.state.isLogin
      ? this.props.loginHandler(this.state.username, this.state.password)
      : this.props.registerHandler(this.state.username, this.state.password, this.state.fullName);
    // TODO: only show in dev env
    event.preventDefault();
  }

  render() {
    return (
      <form className="login" onSubmit={this.handleSubmit}>
        {this.state.isLogin  ? (<>
        <div>
          <label><b>Email</b></label>
          <input type="text" placeholder="Enter Username" name="username" value={this.state.username} onChange={this.handleChange} required/>
        </div>
        <div>
          <label><b>Password</b></label>
          <input type="password" placeholder="Enter Password" name="password" value={this.state.password} onChange={this.handleChange} required />
        </div>
        <div>
          <button type="submit">Login</button>
          <label>
            <input type="checkbox" checked="checked" name="rememberMe" onChange={this.handleChange} />
            Remember me: 
          </label>
          <button type="button" onClick={() => this.setState({ isLogin: false })}>Go to Register</button>
        </div>
        </>
        )
        : (<>
          <div>
            <label><b>Full name</b></label>
            <input type="text" placeholder="Enter full name" name="fullName" value={this.state.fullName} onChange={this.handleChange} required/>
          </div>
          <div>
            <label><b>Email</b></label>
            <input type="text" placeholder="Enter Username" name="username" value={this.state.username} onChange={this.handleChange} required/>
          </div>
          <div>
            <label><b>Password</b></label>
            <input type="password" placeholder="Enter Password" name="password" value={this.state.password} onChange={this.handleChange} required />
          </div>
          <div>
            <button type="submit">Register</button>
            <button type="button" onClick={() => this.setState({ isLogin: true })}>Back to login</button>
          </div>
          </>
        )
        }
      </form>
    )
  }
}

export default Login;


