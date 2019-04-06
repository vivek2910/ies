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

    struct VoterInfo {
        uint aadhar;
        string name;
        address boothAddress;
    }

    struct ElectionDetalis {
        string electionTitle;
        address electionAddress;
    }


    mapping (uint => Constituency) public constituency;
    mapping (uint => Pollbooth) public booth;
    mapping (uint => VoterInfo) public voters;

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

    function createBooth(uint constId, string memory boothDescription, address boothAddress) public {
        require(msg.sender == 0xb78a868E82D16e9deAE3A66b31dCA72E0f55B290);

        Pollbooth memory newBooth = Pollbooth({
            boothId: boothCount,
            constId: constId,
            boothDescription: boothDescription,
            boothAddress: boothAddress
        });
        booth[boothCount] = newBooth;
        boothCount++;
        constituency[constId].boothAddresses[boothAddress] = true;
    }

    function addVoter(uint aadhar, string memory name, uint boothId) public {
        require(msg.sender == 0xb78a868E82D16e9deAE3A66b31dCA72E0f55B290);

        VoterInfo memory voter = VoterInfo({
            aadhar: aadhar,
            name: name,
            boothAddress: booth[boothId].boothAddress
        });
        voters[aadhar] = voter;
    }

    function editConstData(uint constId, string memory newConstName, address newConstAddress) public {
        require(msg.sender == 0xb78a868E82D16e9deAE3A66b31dCA72E0f55B290);
        constituency[constId].constName = newConstName;
        constituency[constId].constAddress = newConstAddress;
    }

    // change what happens with thw const id and booth address in const mapping

    function editBoothData(uint boothId, string memory newBoothDescription, address newBoothAddress) public {
        require(msg.sender == 0xb78a868E82D16e9deAE3A66b31dCA72E0f55B290);
        booth[boothId].boothDescription = newBoothDescription;
        booth[boothId].boothAddress = newBoothAddress;
    }

    function getConst(uint constId) public view returns (uint, string memory, address) {
        return(constituency[constId].constId, constituency[constId].constName, constituency[constId].constAddress);
    }

    function checkBoothAddress(uint constId, address boothAddress) public returns (bool) {
        return (constituency[constId].boothAddresses[boothAddress]);
    }

    function checkVoterBooth(uint aadhar, address boothAdd) public returns(bool) {
        return (voters[aadhar].boothAddress == boothAdd);
    }

    ElectionDetalis[] public electionDetalis;


    function createElection(string memory title) public {
        require(msg.sender == 0xb78a868E82D16e9deAE3A66b31dCA72E0f55B290);

        Election newElectionContract = new Election(title);
        ElectionDetalis memory newElection = ElectionDetalis({
            electionAddress: address(newElectionContract),
            electionTitle: title
        });

        electionDetalis.push(newElection);
    }

    function getDeployedElections() public view returns (uint) {
        return electionDetalis.length;
    }

}

contract Election {

    IES ies;
    string public electionTitle;
    bool public startPoll = false;
    bool public endPoll = false;

    constructor(string memory title) public {
        ies = IES(0x726ABB43641BDe3a8e879C9A3d26b14781c095fb);
        electionTitle = title;
    }

    struct Candidate {
        uint candId;
        uint constId;
        string candName;
        string candParty;
        uint candVotes;
        string symbolHash;
    }

    mapping (uint => uint) public voteInfo ;
    mapping (uint => Candidate) public candidate;
    mapping (uint => uint[]) public candConst;
    mapping (uint => uint) public candConstCount;
    uint public candCount = 1;


    function addCand(uint constId, string memory candName, string memory candParty, string memory symbolHash) public {
        require(msg.sender == 0xb78a868E82D16e9deAE3A66b31dCA72E0f55B290);

        Candidate memory newCandidate = Candidate({
            constId: constId,
            candName: candName,
            candId: candCount,
            candParty: candParty,
            candVotes: 0,
            symbolHash: symbolHash
        });

        candidate[candCount] = newCandidate;
        candConst[constId].push(candCount);
        candConstCount[constId] += 1;
        candCount++;
    }

    function startPolling() public{
        require(msg.sender == 0xb78a868E82D16e9deAE3A66b31dCA72E0f55B290);
        startPoll = true;

    }

    function stopPolling() public {
        require(msg.sender == 0xb78a868E82D16e9deAE3A66b31dCA72E0f55B290);
        endPoll = true;
    }

   function voteCandidate(uint constId, uint candId, uint aadhar) public {
        require(
            (ies.checkBoothAddress(constId, msg.sender) == true) &&
            (ies.checkVoterBooth(aadhar, msg.sender) == true) &&
            (voteInfo[aadhar] == 0)
        );

        candidate[candId].candVotes += 1;
        voteInfo[aadhar] = candId;
    }
}
