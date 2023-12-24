const { ethers } = require("hardhat");

const wait = (seconds) => {
	const milliseconds = seconds * 1000;
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

describe("SelfDestructContract", () => {
	let deployer, addr1;
	let selfDestructContract, selfDestructContractAddress;
	let ownerBalanceBeforeSelfDestruct;

	beforeEach(async () => {
		[deployer, addr1] = await ethers.getSigners();

		selfDestructContract = await ethers.deployContract("SelfDestructContract", { value: ethers.parseEther("1000") });
		selfDestructContractAddress = await selfDestructContract.getAddress();
		ownerBalanceBeforeSelfDestruct = await ethers.provider.getBalance(deployer);
	});

	describe("Deployment", () => {
		test("the contract must be deployed successfully", async () => {
			expect(selfDestructContractAddress).toEqual("0x5FbDB2315678afecb367f032d93F642f64180aa3");
		});

		test("the contract balance must be 1000 ETH", async () => {
			expect(await ethers.provider.getBalance(selfDestructContractAddress)).toEqual(ethers.parseEther("1000"));
		});

		test("the contract owner is set up properly", async () => {
			expect(await selfDestructContract.owner()).toEqual(await deployer.getAddress());
		});

		test("the contract countdown is 10 in the first call", async () => {
			expect(Number(await selfDestructContract._countdown())).toEqual(10);
		});
	});

	describe("SELFDESTRUCT Operation", () => {
		let ownerBalanceAfterSelfDestruct;
		test("only owner can call the destruct() function", async () => {
			try {
				await selfDestructContract.connect(addr1).destruct();
			} catch (e) {
				expect(e.message).toContain("You're NOT the owner!");
			}
		});

		test("selfdestruct operation works as expected", async () => {
			console.log("*** DANGER! SELF DESTRUCT operation is about to be activated, PLEASE PRECEED WITH CAUTION! ***");
			expect(await ethers.provider.getBalance(selfDestructContract)).toEqual(ethers.parseEther("1000"));

			for (let i = 0; i <= 10; i++) {
				try {
					let countdown = Number(await selfDestructContract._countdown());
					await selfDestructContract.connect(deployer).destruct();
					await wait(3);

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
						await wait(4);
						console.info("------------------------------------------------------------------------------");
						await wait(1);
						console.info("------------------------------------------------------------------------------");
						await wait(1);
						console.info("------------------------------------------------------------------------------");
					}
				} catch (e) {
					console.log(
						"**** THE CONTRACT has been SELF DESTRUCTED as expected! It's NO LONGER operational! Have a good day! ****"
					);
					expect(e.message).toContain("code=BAD_DATA");
					expect(await ethers.provider.getBalance(selfDestructContract)).toEqual(ethers.parseEther("0"));
					ownerBalanceAfterSelfDestruct = await ethers.provider.getBalance(deployer);
					break;
				}
			}
		}, 70000);

		test("all of the remaining ethers in the contract has been sent to the owner", async () => {
			ownerBalanceBeforeSelfDestruct = ethers.formatEther(ownerBalanceBeforeSelfDestruct);
			ownerBalanceAfterSelfDestruct = ethers.formatEther(ownerBalanceAfterSelfDestruct);

			expect(Number(ownerBalanceAfterSelfDestruct)).toBeCloseTo(
				Number(ownerBalanceBeforeSelfDestruct) + Number(ethers.formatEther(ethers.parseEther("1000")))
			);
		});
	});
});
