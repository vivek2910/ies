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

class Home extends Component {
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

    const startflag = await election.methods.startPoll().call();
    const endflag = await election.methods.endPoll().call();
    let buttonFlag = null;

    if (startflag == true && endflag == false) {
      buttonFlag = true;
    } else {
      buttonFlag = false;
    }

    return { candidates, constId, address, account, buttonFlag };
  }

  state = {
    candId: "",
    aadhaar: "",
    errorMessage: "",
    loading: false,
    buttonFlag: this.props.buttonFlag
  };

  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });
    console.log(this.props.constId, this.state.candId, this.state.aadhaar);

    try {
      const accounts = await web3.eth.getAccounts();
      const elections = Election(this.props.address);
      await elections.methods
        .voteCandidate(
          this.props.constId,
          this.state.candId,
          this.state.aadhaar
        )
        .send({
          from: accounts[0]
        });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  renderButton() {
    if (this.props.account == "0xb78a868E82D16e9deAE3A66b31dCA72E0f55B290") {
      return (
        <div>
          <Link
            route={`/elections/${this.props.address}/${
              this.props.constId
            }/newCand`}
          >
            <a>
              <Button
                style={{ marginRight: "10px" }}
                content="Add Candidate"
                icon="add circle"
                primary
              />
            </a>
          </Link>

          <Link
            route={`/elections/${this.props.address}/${
              this.props.constId
            }/showResults`}
          >
            <a>
              <Button
                style={{ marginRight: "10px" }}
                disabled={this.state.buttonFlag}
                content="View Results"
                color="green"
              />
            </a>
          </Link>
        </div>
      );
    }
  }

  renderCandidates() {
    const item = this.props.candidates.map(candidate => {
      return {
        key: candidate[0],
        style: { border: "solid" },
        header: <h2 align="middle">{candidate[2]}</h2>,
        image: (
          <Image
            src={`http://localhost:8080/ipfs/${candidate[5]}`}
            width="320"
            height="300"
          />
        ),
        description: (
          <center>
            <b>{candidate[3]}</b>
          </center>
        ),
        extra: (
          <div>
            <Modal
              size="mini"
              trigger={
                <Button
                  value={candidate[0]}
                  onClick={event =>
                    this.setState({
                      candId: event.target.value
                    })
                  }
                  content="VOTE"
                  color="red"
                  fluid={true}
                  disabled={!this.state.buttonFlag}
                />
              }
            >
              <Modal.Header>Enter your Aadhar Number</Modal.Header>
              <Modal.Content>
                <Form
                  onSubmit={this.onSubmit}
                  error={!!this.state.errorMessage}
                >
                  <Form.Field>
                    <Input
                      value={this.state.addhaar}
                      onChange={event =>
                        this.setState({
                          aadhaar: event.target.value
                        })
                      }
                    />
                  </Form.Field>
                  <Message
                    error
                    header="Error!!!"
                    content={this.state.errorMessage}
                  />

                  <Button
                    content="VOTE"
                    color="red"
                    loading={this.state.loading}
                  />
                </Form>
              </Modal.Content>
            </Modal>
          </div>
        )
      };
    });
    return <Card.Group items={item} />;
  }

  render() {
    return (
      <Layout link={`/elections/${this.props.address}/${this.props.constId}`}>
        <div>{this.renderButton()}</div>
        <h3>Candidates:</h3>
        <div border={{ style: "solid", color: "red" }}>
          {this.renderCandidates()}
        </div>
      </Layout>
    );
  }
}

export default Home;

// http://ipfs.io/ipfs/Qmb3SMWdN58wQEUokvHdySKLc1YPfoBkk1fPihRHQ2qt3k
