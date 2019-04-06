import React, { Component } from "react";
import { Button, Container } from "semantic-ui-react";
import Head from "next/head";
import { Link } from "../routes"; // Link helper from routes.js

class Home extends Component {
  render() {
    return (
      <Container>
        <Head>
          <link
            rel="stylesheet"
            href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css"
          />
        </Head>
        <div>
          <Link route="/home">
            <a>
              <Button content="Enter" primary />
            </a>
          </Link>
        </div>
      </Container>
    );
  }
}
export default Home;
