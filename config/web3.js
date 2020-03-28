module.exports = {
    infura: "https://ropsten.infura.io/v3/ba1df01b93614ff182d9898b5ba2f2ce",
    mnemonic: "unit cherry laptop dad twice pyramid loyal attitude danger swim shed march",
    address: "0xc6a787E24c7808A661103956ABC364E0fe677871",
    abi: [
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "string",
                    "name": "email",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "hash",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                }
            ],
            "name": "addWill",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "string",
                    "name": "fromEmail",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "toEmail",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "hash",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                }
            ],
            "name": "transferWill",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "string",
                    "name": "email",
                    "type": "string"
                }
            ],
            "name": "getWills",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "hash",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "time",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "title",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct WillContract.Will[]",
                    "name": "r",
                    "type": "tuple[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]
}