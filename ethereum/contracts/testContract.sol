pragma solidity >=0.4.22 <0.6.0;

contract IES {
    
    uint public constCount = 1;
    uint public boothCount = 1;
    
    struct Constituency {
        uint constId;
        string constName;
        address constAddress; 
        mapping (address => bool) boothAddresses;
    }
    
    struct Pollbooth {
        uint boothId;
        uint constId;
        string boothDescription;
        address boothAddress;
    }
    
    struct voterInfo {
        uint aadhar;
        string name;
        address boothAddress;
    }
    
    mapping (uint => Constituency) public constituency;
    mapping (uint => Pollbooth) public booth;
    mapping (uint => voterInfo) public voters;

    function createConstituency(string memory constName, address constAddress) public {
        require(msg.sender == 0xb78a868E82D16e9deAE3A66b31dCA72E0f55B290);
        
        Constituency memory newConst = Constituency({
            constId: constCount,
            constName: constName,
            constAddress: constAddress
        });
        constituency[constCount] = newConst;
        constCount++;
    }
    
    function createBooth(uint constId, uint boothId, string memory boothDescription, address boothAddress) public {
        require(msg.sender == 0xb78a868E82D16e9deAE3A66b31dCA72E0f55B290);
        
        Pollbooth memory newBooth = Pollbooth({ 
            boothId: boothId,
            constId: constId,
            boothDescription: boothDescription,
            boothAddress: boothAddress
        });
        booth[boothCount] = newBooth;
        boothCount++;
        constituency[constId].boothAddresses[boothAddress]  = true;
    }
    
    function addVoter(uint aadhar, string memory name, uint boothId) public {
        require(msg.sender == 0xb78a868E82D16e9deAE3A66b31dCA72E0f55B290);
        
        voterInfo memory voter = voterInfo({
            aadhar: aadhar,
            name: name,
            boothAddress: booth[boothId].boothAddress
        });
        voters[aadhar] = voter;
    }
    
    function editConstData(uint constId, string memory newConstName, address newConstAddress) public {
        constituency[constId].constName = newConstName;
        constituency[constId].constAddress = newConstAddress;
    }
    
    function editBoothData(uint boothId, string memory newBoothDescription, address newBoothAddress) public {
        booth[boothId].boothDescription = newBoothDescription;
        booth[boothId].boothAddress = newBoothAddress;
    }
    
    function getConst(uint constId) public view returns (string memory, address) {
        return(constituency[constId].constName, constituency[constId].constAddress);
    }
    
    function checkBoothAddress(uint constId, address boothAddress) public returns (bool) {
        return (constituency[constId].boothAddresses[boothAddress]);
    }
    
    function checkVoterBooth(uint aadhar, address boothAdd) public returns(bool) {
        return (voters[aadhar].boothAddress == boothAdd);
    }
    
    address[] public deployedElections;

    function createElection() public {
        Election newElection = new Election();
        deployedElections.push(address(newElection));
    }

    function getDeployedElections() public view returns (address[] memory) {
        return deployedElections;
    }
    
}

contract Election {
    
    IES ies;
    
    constructor() public {
        ies = IES(0x6e6841FD73e319B4e01B4ebAfA72863D16f4E1fe);
    }
    
    struct Candidate {
        uint candId;
        uint constId;
        string candName;
        string candParty;
        uint candVotes;
    }
    
    mapping (uint => uint) voteInfo;
    mapping (uint => Candidate) candidate;
    mapping (uint => uint[]) candConst; 
    mapping (uint => uint) candConstCount;
    uint candCount = 1;
     
    function addCand(uint constId, string memory candName, string memory candParty) public {
        require(msg.sender == 0xb78a868E82D16e9deAE3A66b31dCA72E0f55B290);
        
        Candidate memory newCandidate = Candidate({
            constId: constId,
            candName: candName,
            candId: candCount,
            candParty: candParty,
            candVotes: 0
        });
        
        candidate[candCount] = newCandidate;
        candCount++;
        candConst[constId].push(candCount);
        candConstCount[constId] += 1;
    }
    
    function voteCandidate(uint constId, uint candId, uint aadhar) public {
        require(
            (ies.checkBoothAddress(constId, msg.sender) == true) &&
            (ies.checkVoterBooth(aadhar, msg.sender) == true) &&
            (voteInfo[aadhar] != 0)
        );
         
        candidate[candId].candVotes += 1;
        voteInfo[aadhar] = candId;
    }
}
    