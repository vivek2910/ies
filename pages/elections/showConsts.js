import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Link } from "../../routes";
import web3 from "../../ethereum/web3";
import IES from "../../ethereum/IES";
import { Card, Button, Grid } from "semantic-ui-react";
import Election from "../../ethereum/Election";

class ElectionShow extends Component {
  static async getInitialProps(props) {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    var constCount = await IES.methods.constCount().call();
    var consts = [];
    for (var i = 1; i < constCount; i++) {
      consts.push(await IES.methods.getConst(i).call()); // for future a getter for only the constName can be useful
    }
    var address = props.query.address;
    const election = Election(address);
    const start = await election.methods.startPoll().call();
    const stop = await election.methods.endPoll().call();
    console.log(stop);
    return { address, consts, account, start, stop };
  }

  state = {
    startPoll: this.props.start,
    stopPoll: this.props.stop
  };

  onClickStart = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    const elections = Election(this.props.address);
    await elections.methods.startPolling().send({
      from: accounts[0]
    });
    const strt = await elections.methods.startPoll().call();
    this.setState({ startPoll: strt });
  };

  onClickStop = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    const elections = Election(this.props.address);
    await elections.methods.stopPolling().send({
      from: accounts[0]
    });
    const flag = await elections.methods.endPoll().call();
    console.log(flag);
    this.setState({ stopPoll: flag });
  };

  renderStartButton() {
    if (this.props.account == "0xb78a868E82D16e9deAE3A66b31dCA72E0f55B290") {
      return (
        <div>
          <Button
            style={{ marginRight: "10px" }}
            disabled={this.state.startPoll}
            content="Start Polling"
            color="green"
            style={{ marginBottom: "15px" }}
            onClick={this.onClickStart}
            fluid
          />
        </div>
      );
    }
  }
  renderStopButton() {
    if (
      this.props.account == "0xb78a868E82D16e9deAE3A66b31dCA72E0f55B290" &&
      this.state.startPoll == true
    ) {
      return (
        <div>
          <Button
            style={{ marginRight: "10px" }}
            disabled={this.state.stopPoll}
            content="End Polling"
            color="red"
            style={{ marginBottom: "15px" }}
            floated="right"
            onClick={this.onClickStop}
            fluid
          />
        </div>
      );
    }
  }

  renderConsts() {
    const items = this.props.consts.map(constituency => {
      return {
        header: constituency[1],
        description: (
          <div>
            <Link route={`/elections/${this.props.address}/${constituency[0]}`}>
              <a> Enter Poll</a>
            </Link>
          </div>
        ),
        fluid: true
      };
    });
    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout link={`/elections/${this.props.address}`}>
        <h3>Election</h3>
        <Grid>
          <Grid.Column width={13}>{this.renderConsts()}</Grid.Column>
          <Grid.Column width={3}>
            {this.renderStartButton()}
            {this.renderStopButton()}
          </Grid.Column>
        </Grid>
      </Layout>
    );
  }
}

export default ElectionShow;
