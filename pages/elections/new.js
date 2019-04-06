import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import IES from "../../ethereum/IES";
import web3 from "../../ethereum/web3";
import { Link, Router } from "../../routes"; // Link tag to create anchor like tag and router to progmatically redirect from one page to another

class ElectionNew extends Component {
  static async getInitialProps() {
    const accounts = await web3.eth.getAccounts();
    const Account = accounts[0];
    console.log(Account);
    return { Account };
  }

  // initializing the state of component
  state = {
    electionTitle: "",
    errorMessage: "", // error handling state obj
    loading: false // for the loading spinner
  };
  // method for form submital
  // do not put () in the form tag  <Form> as we are not going to run this function now only passing reference */
  onSubmit = async event => {
    event.preventDefault(); //will keep the browser from attempting to submit the form

    this.setState({ loading: true, errorMessage: "" }); // as soon as the button is clicked spinner appears

    try {
      const accounts = await web3.eth.getAccounts();
      await IES.methods.createElection(this.state.electionTitle).send({
        from: accounts[0]
      });

      Router.pushRoute("/home"); // redirect user back to index route
    } catch (err) {
      // error handling
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false }); // close the spinner
  };

  render() {
    return (
      <Layout>
        <h1>Create an Election!</h1>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Election Title</label>
            <Input
              value={this.state.electionTitle} //takes the state value and pushes it into component
              onChange={event =>
                this.setState({
                  electionTitle: event.target.value
                })
              } //event handler updates the value of value
            />
          </Form.Field>
          <Message error header="Error!!!" content={this.state.errorMessage} />

          <Button loading={this.state.loading} primary>
            Create
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default ElectionNew;

// whenever we want to handle user input in react we are going to setup a piece
// of state to hold the value that the user is entering and then we're also going to add
// a change handler the event handler on the actual input component itself
// so any time the user types new chwr in we're going to update our state and whenever
// we update our state that causes the component to re render
