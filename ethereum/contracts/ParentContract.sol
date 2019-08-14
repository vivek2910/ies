pragma solidity 0.4.26;

contract ParentContract {
  uint public simpleInteger;

  function SetInteger(uint _value) public {
    simpleInteger = _value;
  }
  function GetInteger() public view returns (uint) {
    return 10;
  }
}
