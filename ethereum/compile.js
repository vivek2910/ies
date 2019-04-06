const path = require("path"); // path module
const solc = require("solc"); //solidity compiler module
const fs = require("fs-extra"); //file system module

const buildPath = path.resolve(__dirname, "build"); // setting the path var for build folder
fs.removeSync(buildPath); //overwritting the build folder using remove sync fuction

const iesPath = path.resolve(
  __dirname,
  "contracts",
  "DigitalIdentification.sol"
); //path of contract sol file
const source = fs.readFileSync(iesPath, "utf-8"); //read operation from the contract file to compile
const output = solc.compile(source, 1).contracts; // o/p variable of above compilation

fs.ensureDirSync(buildPath); //create build dir if not present

// the loop saves the contract data in the json files in build folder from
// which we can retrive the ABI of all the contracts

for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract + ".json"),
    output[contract]
  );
}
