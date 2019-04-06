import React, { Component } from "react";
import Layout from "../../components/Layout";
import {
  Card,
  Button,
  Image,
  Modal,
  Form,
  Input,
  Message
} from "semantic-ui-react";
import Election from "../../ethereum/Election";
import web3 from "../../ethereum/web3";
import Head from "next/head";
import { Link } from "../../routes"; // Link helper from routes.js
import ipfs from "../../ipfs/ipfs";

class CandNew extends Component {
  static async getInitialProps(props) {
    const address = props.query.address;
    const constId = props.query.constId;
    const election = Election(address);
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    return { constId, address, election, account };
  }

  state = {
    buffer: null,
    candName: "",
    candParty: "",
    symbolHash: null,
    errorMessage: "",
    loading: false
  };

  captureFile = event => {
    console.log("capturing file....");
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
    };
  };

  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });
    const shash = await ipfs.files.add(this.state.buffer);
    this.setState({ symbolHash: shash[0].hash });
    try {
      const accounts = await web3.eth.getAccounts();
      const elections = Election(this.props.address);
      await elections.methods
        .addCand(
          this.props.constId,
          this.state.candName,
          this.state.candParty,
          this.state.symbolHash
        )
        .send({
          from: accounts[0]
        });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  renderForm() {
    if (this.props.account == "0xb78a868E82D16e9deAE3A66b31dCA72E0f55B290") {
      return (
        <div>
          <h1>Add Candidate Detail</h1>
          <Form
            fluid="false"
            onSubmit={this.onSubmit}
            error={!!this.state.errorMessage}
          >
            <Form.Field>
              <label>Candidate Name</label>
              <Input
                type="text"
                value={this.state.candName}
                onChange={event =>
                  this.setState({
                    candName: event.target.value
                  })
                }
              />
            </Form.Field>
            <Form.Field>
              <label>Candidate Party</label>
              <Input
                type="text"
                value={this.state.candParty}
                onChange={event =>
                  this.setState({
                    candParty: event.target.value
                  })
                }
              />
            </Form.Field>
            <Form.Field>
              <label>Party Symbol</label>
              <Input type="file" onChange={this.captureFile} />
            </Form.Field>
            <Form.Field>
              <Button primary loading={this.state.loading}>
                Add Candidate
              </Button>
              <Message
                error
                header="Error!!!"
                content={this.state.errorMessage}
              />
            </Form.Field>
          </Form>
        </div>
      );
    } else {
      return <div>Only Admin Authorized</div>;
    }
  }

  render() {
    return (
      <Layout
        link={`/elections/${this.props.address}/${this.props.constId}/newCand`}
      >
        {this.renderForm()}
      </Layout>
    );
  }
}

export default CandNew;
