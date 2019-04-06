import React, { Component } from "react";
import Layout from "../components/Layout";
import { Link, Router } from "../routes";
import web3 from "../ethereum/web3";
import IES from "../ethereum/IES";
import { Button, Table, Modal, Form, Input, Message } from "semantic-ui-react";

class Voter extends Component {
  state = {
    flag: false,
    aadhaarSearch: "",
    voterAadhaar: "",
    voterName: "",
    boothAddress: ""
  };

  renderRow(name, address, aadhaar) {
    return (
      <Table.Row>
        <Table.Cell>{aadhaar}</Table.Cell>
        <Table.Cell>{name}</Table.Cell>
        <Table.Cell>{address}</Table.Cell>
      </Table.Row>
    );
  }

  renderTable(aadhaar, name, address) {
    if (this.state.flag) {
      return (
        <div>
          <Table celled style={{ marginTop: "15px" }}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>AADHAAR NO.</Table.HeaderCell>
                <Table.HeaderCell>NAME</Table.HeaderCell>
                <Table.HeaderCell>BOOTH_ADDRESS</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{this.renderRow(name, address, aadhaar)}</Table.Body>
          </Table>
          <Button
            content="CLOSE"
            onClick={event => this.setState({ flag: false })}
            color="red"
            size="mini"
            floated="right"
          />
        </div>
      );
    }
  }

  onClickShow = async event => {
    event.preventDefault();
    const voter = await IES.methods.voters(this.state.aadhaarSearch).call();
    this.setState({
      voterAadhaar: voter[0],
      voterName: voter[1],
      boothAddress: voter[2],
      flag: true,
      aadhaarSearch: ""
    });
  };

  render() {
    return (
      <Layout>
        <div style={{ marginBottom: "20px", marginTop: "40px" }}>
          <center>
            <h2>View Voter Info</h2>
          </center>
        </div>
        <center>
          <Input
            value={this.state.aadhaarSearch}
            onChange={event =>
              this.setState({
                aadhaarSearch: event.target.value
              })
            }
            action={
              <Button onClick={this.onClickShow} color="green">
                <b>View</b>
              </Button>
            }
            placeholder="Enter Aadhar No.."
            type="text"
            size="large"
            style={{ width: 500, color: "red" }}
          />
        </center>

        <div>
          {this.renderTable(
            this.state.voterAadhaar,
            this.state.voterName,
            this.state.boothAddress
          )}
        </div>
      </Layout>
    );
  }
}

export default Voter;
