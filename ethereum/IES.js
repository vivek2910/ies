import web3 from "./web3";

import IES from "./build/IES.json";

const instance = new web3.eth.Contract(
  JSON.parse(IES.interface),
  "0x726ABB43641BDe3a8e879C9A3d26b14781c095fb"
);

export default instance;
