pragma solidity >=0.4.22 <0.6.0;
pragma experimental ABIEncoderV2;

contract WillContract {

    struct Will {
        string hash;
        uint256 timestamp;
        string title;
    }
   
    mapping(string => Will[]) emailToWills;


    constructor() public {
    }


    function compareStrings(string memory a, string memory b) private view returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function find(string memory email, string memory hash, string memory title) private view returns(int index) {
        index = -1;
        for (uint256 i = 0; i < emailToWills[email].length; i++) {
            if (compareStrings(emailToWills[email][i].hash, hash) && compareStrings(emailToWills[email][i].title, title)) {
                index = int(i);
            }
        }
    }


    function removeByIndex (string memory email, uint i) private {


        while (i < emailToWills[email].length - 1) {
            emailToWills[email][i] = emailToWills[email][i+1];
            i++;
        }
        emailToWills[email].length--;
    }

    function addWill(string memory email, string memory hash, string memory title) public {
        Will memory will = Will({  timestamp: now, hash: hash, title: title });
        emailToWills[email].push(will);
    }

    function transferWill(string memory fromEmail, string memory toEmail, string memory hash, string memory title) public {
        uint i = uint256(find(fromEmail, hash, title));
        removeByIndex(fromEmail, i);
        Will memory will = Will({  timestamp: now, hash: hash, title: title });
        emailToWills[toEmail].push(will);
    }


    function getWills(string memory email) public view returns (Will[] memory v) {
        v = emailToWills[email];
    }
}