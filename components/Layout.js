import React from "react";
import Head from "next/head";
import Header from "./Header";
import { Container } from "semantic-ui-react";
export default props => {
  // const Header = Header("vivek");
  return (
    <Container>
      <Head>
        <link
          rel="stylesheet"
          href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css"
        />
      </Head>
      <Header link={props.link} />
      {props.children}
    </Container>
  );
};

// <Head used for adding the tags to the head tag of renderd html in the browser
