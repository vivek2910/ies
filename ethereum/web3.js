import Web3 from "web3";

let web3; // let lets to re-assign the var

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
	//typeof to see if window variable is defined
	// we are in the browser and metamask is running
	web3 = new Web3(window.web3.currentProvider);
} else {
	// we are on server *OR* the user not running metamask
	const provider = new Web3.providers.HttpProvider(
		"https://rinkeby.infura.io/v3/7dcd4b5846404208a87d35735810933c"
	);
	web3 = new Web3(provider);
}




//const web3 = new Web3(window.web3.currentProvider);

export default web3;
