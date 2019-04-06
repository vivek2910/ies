import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Message, Table, Image } from "semantic-ui-react";
import IES from "../../ethereum/IES";
import web3 from "../../ethereum/web3";
import Election from "../../ethereum/Election";

class ShowResults extends Component {
  static async getInitialProps(props) {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const address = props.query.address;
    const constId = props.query.constId;
    const election = Election(address);
    const candidates = [];
    const candConstCount = await election.methods
      .candConstCount(constId)
      .call();

    for (var i = 0; i < candConstCount; i++) {
      const candId = await election.methods.candConst(constId, i).call();
      candidates.push(await election.methods.candidate(candId).call());
    }
    const constName = (await IES.methods.constituency(constId).call())[1];
    return { candidates, constId, address, account, constName };
  }

  renderRow() {
    const items = this.props.candidates.map(candidate => {
      return (
        <Table.Row key={candidate[0]}>
          <Table.Cell>{candidate[0]}</Table.Cell>
          <Table.Cell verticalAlign="middle">
            <Image
              src={`http://localhost:8080/ipfs/${candidate[5]}`}
              width="35"
              height="35"
              style={{ display: "inline" }}
              // floated="right"
            />
            &nbsp;&nbsp;
            {candidate[2]}
          </Table.Cell>
          <Table.Cell>{candidate[3]}</Table.Cell>
          <Table.Cell>{candidate[4]}</Table.Cell>
        </Table.Row>
      );
    });
    return items;
  }

  render() {
    return (
      <Layout>
        <center>
          <h3 style={{ marginTop: "20px", marginBottom: "20px" }}>
            RESULTS &nbsp; &nbsp; FOR &nbsp; &nbsp;
            {this.props.constName}
          </h3>
        </center>

        <div>
          <Table celled verticalAlign="middle">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.HeaderCell>NAME</Table.HeaderCell>
                <Table.HeaderCell>PARTY</Table.HeaderCell>
                <Table.HeaderCell>VOTE COUNT</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{this.renderRow()}</Table.Body>
          </Table>
        </div>
      </Layout>
    );
  }
}

export default ShowResults;
