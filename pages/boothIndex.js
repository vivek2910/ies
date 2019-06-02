import React, { Component } from "react";
import Layout from "../components/Layout";
import { Link, Router } from "../routes";
import web3 from "../ethereum/web3";
import IES from "../ethereum/IES";
import { Button, Table, Modal, Form, Input, Message } from "semantic-ui-react";

class BoothIndex extends Component {
  static async getInitialProps(props) {
    var boothCount = await IES.methods.boothCount().call();
    var booths = [];
    for (var i = 1; i < boothCount; i++) {
      booths.push(await IES.methods.booth(i).call());
    }
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    return { booths, account };
  }

  state = {
    constId: "",
    boothId: "",
    boothDescription: "",
    boothAddress: "",
    voterName: "",
    voterAadhaar: "",
    errorMessage: "",
    loading: false
  };

  onSubmitNew = async event => {
    event.preventDefault();
    console.log("abc");
    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      console.log(accounts[0]);
      await IES.methods
        .createBooth(
          this.state.constId,
          this.state.boothDescription,
          this.state.boothAddress
        )
        .send({
          from: accounts[0]
        });

      // Router.pushRoute("/constituencies/constsIndex");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  onSubmitEdit = async event => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      await IES.methods
        .editBoothData(
          this.state.boothId,
          this.state.boothDescription,
          this.state.boothAddress
        )
        .send({
          from: accounts[0]
        });

      //Router.pushRoute("/constituencies/constsIndex");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  onSubmitVoter = async event => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      console.log(accounts[0]);
      await IES.methods
        .addVoter(
          this.state.voterAadhaar,
          this.state.voterName,
          this.state.boothId
        )
        .send({
          from: accounts[0]
        });

      // Router.pushRoute("/constituencies/constsIndex");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  renderRow() {
    const items = this.props.booths.map(booth => {
      return (
        <Table.Row key={parseInt(booth[0]).toString()}>
          <Table.Cell>{parseInt(booth[0]).toString()}</Table.Cell>
          <Table.Cell>{parseInt(booth[1]).toString()}</Table.Cell>
          <Table.Cell>{booth[2]}</Table.Cell>
          <Table.Cell>{booth[3]}</Table.Cell>

          {/* Table Cell for Adding Voter */}

          <Table.Cell textAlign="center">
            <Modal
              trigger={
                <Button
                  value={booth[0]}
                  onClick={event =>
                    this.setState({
                      boothId: event.target.value,
                      voterName: "",
                      voterAadhaar: ""
                    })
                  }
                  content="Add Voter"
                  color="green"
                  size="mini"
                  //style={{ visibility: x }}
                />
              }
              size="small"
            >
              <Modal.Header>Add Voter</Modal.Header>
              <Modal.Content>
                <Form
                  onSubmit={this.onSubmitVoter}
                  error={!!this.state.errorMessage}
                >
                  <Form.Field>
                    <label>Voter Name</label>
                    <Input
                      value={this.state.voterName}
                      onChange={event =>
                        this.setState({
                          voterName: event.target.value
                        })
                      }
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Voter Aadhaar</label>
                    <Input
                      value={this.state.voterAadhaar}
                      onChange={event =>
                        this.setState({
                          voterAadhaar: event.target.value
                        })
                      }
                    />
                  </Form.Field>
                  <Form.Field>
                    <Button
                      content="Add"
                      loading={this.state.loading}
                      primary
                    />
                  </Form.Field>
                  <Message
                    error
                    header="Error!!!"
                    content={this.state.errorMessage}
                  />
                </Form>
              </Modal.Content>
            </Modal>
          </Table.Cell>
        </Table.Row>
      );
    });
    return items;
  }

  renderModals() {
    if (this.props.account == "0xb78a868E82D16e9deAE3A66b31dCA72E0f55B290") {
      return (
        <div style={{ marginBottom: "15px" }}>
          {/* Form for adding new booth */}

          <Modal
            trigger={
              <Button
                content="Add Booth"
                style={{ marginRight: "10px" }}
                onClick={event =>
                  this.setState({
                    constId: "",
                    boothDescription: "",
                    boothAddress: ""
                  })
                }
                primary
              />
            }
            size="small"
          >
            <Modal.Header>Add Booth</Modal.Header>
            <Modal.Content>
              <Form
                onSubmit={this.onSubmitNew}
                error={!!this.state.errorMessage}
              >
                <Form.Field>
                  <label>Constituency Id</label>
                  <Input
                    value={this.state.constId}
                    onChange={event =>
                      this.setState({
                        constId: event.target.value
                      })
                    }
                  />
                </Form.Field>
                <Form.Field>
                  <label>Booth Description</label>
                  <Input
                    value={this.state.boothDescription}
                    onChange={event =>
                      this.setState({
                        boothDescription: event.target.value
                      })
                    }
                  />
                </Form.Field>
                <Form.Field>
                  <label>Booth Address</label>
                  <Input
                    value={this.state.boothAddress}
                    onChange={event =>
                      this.setState({
                        boothAddress: event.target.value
                      })
                    }
                  />
                </Form.Field>
                <Form.Field>
                  <Button content="Add" loading={this.state.loading} primary />
                </Form.Field>
                <Message
                  error
                  header="Error!!!"
                  content={this.state.errorMessage}
                />
              </Form>
            </Modal.Content>
          </Modal>

          {/* Form for editing existing booth */}

          <Modal
            trigger={
              <Button
                content="Edit Booth"
                style={{ marginRight: "10px" }}
                onClick={event =>
                  this.setState({
                    boothId: "",
                    constId: "",
                    boothDescription: "",
                    boothAddress: ""
                  })
                }
                primary
              />
            }
            size="small"
          >
            <Modal.Header>Edit Booth</Modal.Header>
            <Modal.Content>
              <Form
                onSubmit={this.onSubmitEdit}
                error={!!this.state.errorMessage}
              >
                <Form.Field>
                  <label>Booth Id</label>
                  <Input
                    value={this.state.boothId}
                    onChange={event =>
                      this.setState({
                        boothId: event.target.value
                      })
                    }
                  />
                </Form.Field>
                <Form.Field>
                  <label>Booth Description</label>
                  <Input
                    value={this.state.boothDescription}
                    onChange={event =>
                      this.setState({
                        boothDescription: event.target.value
                      })
                    }
                  />
                </Form.Field>
                <Form.Field>
                  <label>Address</label>
                  <Input
                    value={this.state.boothAddress}
                    onChange={event =>
                      this.setState({
                        boothAddress: event.target.value
                      })
                    }
                  />
                </Form.Field>
                <Form.Field>
                  <Button
                    content="Save Changes"
                    loading={this.state.loading}
                    primary
                  />
                </Form.Field>
                <Message
                  error
                  header="Error!!!"
                  content={this.state.errorMessage}
                />
              </Form>
            </Modal.Content>
          </Modal>
        </div>
      );
    }
  }

  render() {
    return (
      <Layout link="/boothIndex">
        <center>
          <h3>POLLING BOOTH LIST</h3>
        </center>
        <div>{this.renderModals()}</div>
        <div>
          <Table celled style={{ marginTop: "15px" }}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={2}>BOOTH_ID</Table.HeaderCell>
                <Table.HeaderCell>CONST_ID</Table.HeaderCell>
                <Table.HeaderCell>BOOTH_DESCRIPTION</Table.HeaderCell>
                <Table.HeaderCell>BOOTH_ADDRESS</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>{this.renderRow()}</Table.Body>
          </Table>
        </div>
      </Layout>
    );
  }
}

export default BoothIndex;
