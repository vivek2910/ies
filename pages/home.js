import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
import IES from "../ethereum/IES";
import Layout from "../components/Layout";
import { Link } from "../routes";
import web3 from "../ethereum/web3";

class ElectionIndex extends Component {
  static async getInitialProps() {
    const ElectionCount = await IES.methods.getDeployedElections().call();
    const Elections = [];

    for (var i = 0; i < ElectionCount; i++) {
      Elections.push(await IES.methods.electionDetalis(i).call());
    }
    const accounts = await web3.eth.getAccounts();
    const Account = accounts[0];
    return { Elections, Account };
  }

  renderElections() {
    const items = this.props.Elections.map(address => {
      return {
        header: address[0],
        description: (
          <Link route={`/elections/${address[1]}`}>
            <a> Enter Poll </a>
          </Link>
        ),
        fluid: true
      };
    });
    return <Card.Group items={items} />;
  }

  renderReload() {
    return (
      <Link route="/home">
        <a>
          <Button icon icon="redo" primary floated="right" />
        </a>
      </Link>
    );
  }

  renderButton() {
    if (this.props.Account == "0xb78a868E82D16e9deAE3A66b31dCA72E0f55B290") {
      return (
        <Link route="/elections/new">
          <a>
            <Button
              content="Create Election"
              icon="add circle"
              primary
              floated="right"
            />
          </a>
        </Link>
      );
    }
  }

  render() {
    return (
      <Layout link="/home">
        <div>
          <h3> Elections </h3>
          {this.renderButton()}
          {this.renderElections()}
        </div>
      </Layout>
    );
  }
}

export default ElectionIndex;
