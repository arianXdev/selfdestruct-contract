const { ethers } = require("hardhat");

async function main() {
	const selfDestructContract = await ethers.deployContract("SelfDestructContract", {
		value: ethers.parseEther("0.3"),
	});

	selfDestructContract.waitForDeployment();

	console.log(`SelfDestructContract has been deployed at ${await selfDestructContract.getAddress()} successfully!`);
	console.log(
		`SelfDestructContract's balance upon deployment was ${ethers.formatEther(
			await ethers.provider.getBalance(await selfDestructContract.getAddress())
		)} ETH`
	);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
