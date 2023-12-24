const { ethers, Contract } = require("ethers");
require("dotenv").config();

const wait = (seconds) => {
	const milliseconds = seconds * 1000;
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

async function main() {
	// Configuring the connection to an Ethereum node
	const provider = new ethers.AlchemyProvider("sepolia", process.env.ALCHEMY_API_KEY);

	// Creating a signing account from a private key
	const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

	const CONTRACT_ABI = [
		{ inputs: [], stateMutability: "payable", type: "constructor" },
		{
			inputs: [],
			name: "_countdown",
			outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
			stateMutability: "view",
			type: "function",
		},
		{ inputs: [], name: "destruct", outputs: [], stateMutability: "nonpayable", type: "function" },
		{
			inputs: [],
			name: "owner",
			outputs: [{ internalType: "address", name: "", type: "address" }],
			stateMutability: "view",
			type: "function",
		},
	];

	const selfDestructContract = new Contract("0x89088d9a91eF4B876Fb7AE1B9E48896F9A1695E0", CONTRACT_ABI, provider);

	console.log("*** DANGER! SELF DESTRUCT operation is about to be activated, PLEASE PRECEED WITH CAUTION! ***");

	let countdown = Number(await selfDestructContract._countdown());
	let tx;

	for (let i = 0; i <= countdown; i++) {
		countdown = Number(await selfDestructContract._countdown());
		tx = await selfDestructContract.connect(signer).destruct();
		await tx.wait();
		await wait(25);

		console.log("countdown to activate 'SELFDESTRUCT' OPERATION: ", countdown);
		if (countdown === 2) {
			await wait(5);
			console.info("------------------------------------------------------------------------------");
			await wait(1);
			console.info("------------------------------------------------------------------------------");
			await wait(1);
			console.info("------------------------------------------------------------------------------");
			await wait(1);
			console.info("......................... DESTROYING THE CONTRACT ............................");
			await wait(1);
			console.info("------------------------------------------------------------------------------");
			await wait(1);
			console.info("------------------------------------------------------------------------------");
			await wait(1);
			console.info("------------------------------------------------------------------------------");
		}

		console.log(`https://sepolia.etherscan.io/tx/${tx.hash}`);
		console.log(`--------------------------------------------------------------------------------`);
	}

	console.log("**** THE CONTRACT has been SELF DESTRUCTED as expected! It's NO LONGER operational! Have a good day! ****");
}

main();
