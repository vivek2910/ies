import React, { Component } from "react";
import Layout from "../components/Layout";
import { Button, Table, Modal, Form, Input, Message } from "semantic-ui-react";
import ipfs from "../ipfs/ipfs";

class ImageUpload extends Component {
  state = {
    buffer: null,
    ipfsHash: null
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

  onSubmit = event => {
    event.preventDefault();
    console.log("submitting....");
    ipfs.files.add(this.state.buffer, (error, result) => {
      if (error) {
        console.error(error);
        return;
      }
      this.setState({ ipfsHash: result[0].hash });
    });
  };

  render() {
    return (
      <Layout>
        <div>
          <Input type="file" onChange={this.captureFile} />
        </div>
        <div>
          <Button primary content="Submit" onClick={this.onSubmit} />
        </div>
      </Layout>
    );
  }
}

export default ImageUpload;
