pragma solidity >=0.4.22 <0.6.0;

contract DigitalIdentification{

    uint userCount = 0;

    // structure to store DI data
    struct User {
        uint id;
        string name;
        string dob;
        string gender;
        string user_address;
        bool isValid;
    }

    mapping (uint => User) public user;


    // function to add data parameters name, date of birth, gender, and address
    function addData(string memory name, string memory dob, string memory gender, string memory user_address) public{
          User memory newUser = User({
            id: userCount,
            name: name,
            dob: dob,
            gender: gender,
            user_address: user_address,
            isValid: true
        });
        user[userCount] = newUser;
        userCount++;
    }

    // verifyData will also have input params as addData() with addition oh id and will return only true/false if the parameter matches the respective id
    function verifyData(uint user_id, string memory user_name, string memory user_dob, string memory user_gender, string memory user_Address) public view returns(bool){
       if(
           (keccak256(abi.encodePacked(user[user_id].name)) == keccak256(abi.encodePacked(user_name))) &&
           (keccak256(abi.encodePacked(user[user_id].dob)) == keccak256(abi.encodePacked(user_dob))) &&
           (keccak256(abi.encodePacked(user[user_id].gender)) == keccak256(abi.encodePacked(user_gender))) &&
           (keccak256(abi.encodePacked(user[user_id].user_address)) == keccak256(abi.encodePacked(user_Address))) &&
           (user[user_id].isValid == true)
           ){
           return true;
       }
       else {
           return false;
       }
    }

    // function to get the DI data by giving the id as parameter
    function getDIData(uint user_id) public view returns(uint, string memory, string memory, string memory, string memory, bool ){
        return(user[user_id].id, user[user_id].name, user[user_id].dob, user[user_id].gender, user[user_id].user_address, user[user_id].isValid);
    }

    // function to invalidate user
    function invalidateDI(uint user_id)public{
        user[user_id].isValid = false;
    }

    // function to call user userCount
    function getCount() public view returns (uint){
        return userCount;
    }

}
