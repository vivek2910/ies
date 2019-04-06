const routes = require("next-routes")();
// importing the next-route library
// the second parent-thesis () states that we are invoking a function

routes
  .add("/home", "/home")
  .add("/elections/new", "elections/new")
  .add("/constituencies/constsIndex", "/constituencies/constsIndex")
  .add("/elections/:address", "/elections/showConsts")
  .add("/elections/:address/:constId", "/elections/showConstCandidates")
  .add("/elections/:address/:constId/newCand", "/elections/newCand")
  .add("/elections/:address/:constId/showResults", "/elections/showResults");

// the : before address tells that this part of the url is going to be wildcard or a variable of sorts
// the second argument is the page where the browser redirects when the first arg is there as url
module.exports = routes; // will export some helpers that will allow us to auto navigate users around our app
