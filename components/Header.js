import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Link } from "../routes"; // Link helper from routes.js

export default props => {
  return (
    <Menu style={{ marginTop: "20px" }}>
      <Menu.Menu>
        <Link route="/home">
          <a className="item"> IES Home</a>
        </Link>
      </Menu.Menu>
      <Menu.Menu>
        <Link route="/constituencies/constsIndex">
          <a className="item">Constituency</a>
        </Link>
      </Menu.Menu>
      <Menu.Menu>
        <Link route="/boothIndex">
          <a className="item">Poll Booths</a>
        </Link>
      </Menu.Menu>
      <Menu.Menu>
        <Link route="/voter">
          <a className="item">Voter Info</a>
        </Link>
      </Menu.Menu>
      <Menu.Menu position="right">
        <Link route={props.link}>
          <a className="item">
            <Icon name="redo" />
          </a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

// The <link> tag is actually a generic wrapper component that does not add in any
// html of ots own instead it wraps its children with click event handler so if
// anyone clicks any of its children its going to auto navigate the user around the
// page. so we use an anchor tag <a>that gives the underline link effect to the text
