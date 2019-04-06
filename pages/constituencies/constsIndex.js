import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Link, Router } from "../../routes";
import web3 from "../../ethereum/web3";
import IES from "../../ethereum/IES";
import { Button, Table, Modal, Form, Input, Message } from "semantic-ui-react";

class ConstsIndex extends Component {
  static async getInitialProps(props) {
    var constCount = await IES.methods.constCount().call();
    var consts = [];
    for (var i = 1; i < constCount; i++) {
      consts.push(await IES.methods.getConst(i).call()); // for future a getter for only the constName can be useful
    }
    return { consts };
  }

  state = {
    constId: "",
    constName: "",
    errorMessage: "",
    loading: false,
    address: ""
  };

  onSubmitNew = async event => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      await IES.methods
        .createConstituency(this.state.constName, this.state.address)
        .send({
          from: accounts[0]
        });

      Router.pushRoute("/constituencies/constsIndex");
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
        .editConstData(
          this.state.constId,
          this.state.constName,
          this.state.address
        )
        .send({
          from: accounts[0]
        });

      Router.pushRoute("/constituencies/constsIndex");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  renderRow() {
    const items = this.props.consts.map(constituency => {
      return (
        <Table.Row key={constituency[0]}>
          <Table.Cell>{constituency[0]}</Table.Cell>
          <Table.Cell>{constituency[1]}</Table.Cell>
          <Table.Cell>{constituency[2]}</Table.Cell>
        </Table.Row>
      );
    });
    return items;
  }

  renderModals() {
    return (
      <div style={{ marginBottom: "15px" }}>
        <Modal
          trigger={
            <Button
              content="Add Constituency"
              style={{ marginRight: "10px" }}
              onClick={event =>
                this.setState({
                  constName: "",
                  address: ""
                })
              }
              primary
            />
          }
          size="small"
        >
          <Modal.Header>Enter Constituency Name</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.onSubmitNew} error={!!this.state.errorMessage}>
              <Form.Field>
                <label>Name</label>
                <Input
                  value={this.state.constName}
                  onChange={event =>
                    this.setState({
                      constName: event.target.value
                    })
                  }
                />
              </Form.Field>
              <Form.Field>
                <label>Address</label>
                <Input
                  value={this.state.address}
                  onChange={event =>
                    this.setState({
                      address: event.target.value
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

        <Modal
          trigger={
            <Button
              content="Edit Constituency"
              style={{ marginRight: "10px" }}
              onClick={event =>
                this.setState({
                  constId: "",
                  constName: "",
                  address: ""
                })
              }
              primary
            />
          }
          size="small"
        >
          <Modal.Header>Edit Constituency</Modal.Header>
          <Modal.Content>
            <Form
              onSubmit={this.onSubmitEdit}
              error={!!this.state.errorMessage}
            >
              <Form.Field>
                <label>ID</label>
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
                <label>Name</label>
                <Input
                  value={this.state.constName}
                  onChange={event =>
                    this.setState({
                      constName: event.target.value
                    })
                  }
                />
              </Form.Field>
              <Form.Field>
                <label>Address</label>
                <Input
                  value={this.state.address}
                  onChange={event =>
                    this.setState({
                      address: event.target.value
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

  render() {
    return (
      <Layout link="/constituencies/constsIndex">
        <center>
          <h3>Constituency List</h3>
        </center>

        {this.renderModals()}
        <div>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={2}>ID</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell> </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{this.renderRow()}</Table.Body>
          </Table>
        </div>
      </Layout>
    );
  }
}

export default ConstsIndex;
