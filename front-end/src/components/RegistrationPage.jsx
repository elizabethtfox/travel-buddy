import React from 'react';
import { Redirect } from 'react-router-dom';
import { Jumbotron, Button, FormGroup, Col, Row, Grid, ControlLabel, FormControl } from 'react-bootstrap'
import axios from 'axios';
import './RegistrationPage.css';

class RegistrationPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.state = {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      rank_food: '',
      rank_arts: '',
      rank_nightlife: '',
      rank_history: '',
      rank_price: '',
      password: '',
      password_confirmation: '',
      redirect: false
    };
  }

  // getValidationState() {
  //   const length = this.state.value.length;
  //   if (length > 10) return 'success';
  //   else if (length > 5) return 'warning';
  //   else if (length > 0) return 'error';
  //   return null;
  // }RIBUTE FROM FormGroup: validationState={this.getValidationState()}

  handleFormSubmit(event){
    axios.post('http://localhost:3001/user/register', {
      username: this.state.username,
      firstName: this.state.firstName,
      lastName: this.state.firstName,
      email: this.state.email,
      rank_food: this.state.rank_food,
      rank_arts: this.state.rank_arts,
      rank_nightlife: this.state.rank_nightlife,
      rank_history: this.state.rank_history,
      rank_price: this.state.rank_price,
      password: this.state.password
    })
    .then((response)=>{
      console.log(response);
      // IF REGISTRATION IS SUCCESSFUL:
      this.setState({redirect: true});
    })
    .catch((error)=>{console.log(error)});
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  render() {
    if (this.state.redirect) {
      return (<Redirect to='/'/>)
    }

    return (
      <Jumbotron>      
        <FormGroup>
          <Grid>
          <h1>Join the Club</h1>
          <br></br>
            <Row>
              <Col md={6}>
                <FormControl
                  id='firstName'
                  type="text"
                  value={this.state.firstName}
                  placeholder="*First Name"
                  onChange={this.handleChange}
                />
              </Col>
              <Col md={6}>
                <FormControl
                  id='lastName'
                  type="text"
                  value={this.state.lastName}
                  placeholder="*Last Name"
                  onChange={this.handleChange}
                />
              </Col>
            </Row>
            <FormControl
              id='username'
              type="text"
              value={this.state.username}
              placeholder="*Username"
              onChange={this.handleChange}
            />
            <FormControl
              id='email'
              type="text"
              value={this.state.email}
              placeholder="*Email"
              onChange={this.handleChange}
            />
            <FormControl
              id='password'
              type="password"
              value={this.state.password}
              placeholder="*Password"
              onChange={this.handleChange}
            />
            <FormControl
              id='password_confirmation'
              type="password"
              value={this.state.password_confirmation}
              placeholder="*Confirm Password"
              onChange={this.handleChange}
            />
            <br></br>
            <br></br>

            <ControlLabel>Preferences</ControlLabel>
            <FormControl
              id='rank_food'
              type="text"
              value={this.state.rank_food}
              placeholder="Rank Food from 1 to 10"
              onChange={this.handleChange}
            />
            <FormControl
              id='rank_arts'
              type="text"
              value={this.state.rank_arts}
              placeholder="Rank Arts from 1 to 10"
              onChange={this.handleChange}
            />
            <FormControl
              id='rank_nightlife'
              type="text"
              value={this.state.rank_nightlife}
              placeholder="Rank Price from 1 to 10"
              onChange={this.handleChange}
            />
            <FormControl
              id='rank_history'
              type="text"
              value={this.state.rank_history}
              placeholder="Rank History from 1 to 10"
              onChange={this.handleChange}
            />
            <FormControl
              id='rank_price'
              type="text"
              value={this.state.rank_price}
              placeholder="Rank Price from 1 to 10"
              onChange={this.handleChange}
            />
            <FormControl.Feedback />
            {/*<HelpBlock>Validation is based on string length.</HelpBlock>*/}
          </Grid>
        </FormGroup>
        <Button bsStyle='primary' id='register_button' onClick={this.handleFormSubmit}>Register!!</Button>
      </Jumbotron>
    );
  }
}

export default RegistrationPage;