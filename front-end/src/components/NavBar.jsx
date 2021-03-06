import React, { Fragment } from 'react';
import { Navbar, Nav, NavItem, Button } from 'react-bootstrap';
import LoginModalLauncher from './LoginModalLauncher.jsx';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './NavBar.css';
// import logo from './logo.png';
// <img src={logo} width="50" height="50" />

class NavBar extends React.Component {
  constructor(){
    super();
    this.logout = this.logout.bind(this);
    this.renderNavItems = this.renderNavItems.bind(this)
  }

  logout(){
    console.log('LOGGING OUT!');
    this.props.logOut();
  }

  renderNavItems() {
    // Depending if there is a user logged in or not, will render LOGIN and REGISTER buttons,
    // or 'MY_USERNAME' and LOGOUT buttons
    if (this.props.currentUser.username) {
      return (
        <Fragment>
          <NavItem componentClass={ Link } href='/profile' to='/profile'>
            <Button className="nav-button" bsStyle="link">Hello, {this.props.currentUser.username}!</Button>
          </NavItem>
          <NavItem componentClass={ Link } href='/trips' to='/trips'>
            <Button className="nav-button" bsStyle="link">Trips</Button>
          </NavItem>
          <NavItem>
            <Button className="nav-button" bsStyle="link" onClick={this.logout}>Logout</Button>
          </NavItem>
        </Fragment>)
    } else {
      return (
        <Fragment>
          <NavItem>
            <LoginModalLauncher logIn={this.props.logIn} />
          </NavItem>
          <NavItem componentClass={ Link } href='/register' to='/register'>
            <Button className="nav-button" bsStyle="link">Register</Button>
          </NavItem>
        </Fragment>
      )
    }
  }

  render() {
    return (
      <Navbar collapseOnSelect fixedTop>
        <Navbar.Header>
          <Navbar.Brand>

            <Link id="nav-brand-name" to='/#section1'>Travel Buddy</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
              { this.renderNavItems() }
  {/*          <NavDropdown title="My Profile" id="basic-nav-dropdown">
              <MenuItem>Sign Out</MenuItem>
              <MenuItem>Other actions</MenuItem>
              <MenuItem>Other actions</MenuItem>
            </NavDropdown>*/}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavBar;
