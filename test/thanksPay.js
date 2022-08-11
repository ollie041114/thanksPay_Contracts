const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

var thanksPay;
describe("ThanksPay", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function deployThanksPay() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const ThanksPay = await ethers.getContractFactory("ThanksPay");
    const thanksPay = await ThanksPay.deploy(0, 0);
    await thanksPay.deployed();

    return { contract: thanksPay, owner };
  }

  describe("Deployment", function () {
    it("Should create contract, the worker and the partner", async function () {
      const {contract, owner} = await  loadFixture(deployThanksPay);
      thanksPay = contract;
      console.log(thanksPay.address);
      const partner = await thanksPay.registerPartner(
        1, // pId
        "p_license", // license,
        15 // payday
        );

      const partnerBalance = await thanksPay.changePartnerBalance(
        1, // pId
        50000, // change);
      );

      const worker = await thanksPay.registerWorker(
        1, //wId
        1, // pId
        "ollie041114@gmail.com",
        "w_license",
        100,
        90, // initialBalance
      );

      const p_balance = await thanksPay.getPartnerBalance(1);

      const w_balance = await thanksPay.getWorkerBalance(1, 0);

      console.log(p_balance, w_balance);
      expect(await p_balance.to.equal(50000));
      expect(await w_balance.to.equal(90));
    });

    it("Should change the balance correctly", async function () {

      expect(await thankspay.owner()).to.equal(owner.address);
      const month = await thanksPay.startMonth(
        1, //wId
        1, // pId
        "ollie041114@gmail.com",
        "w_license",
        100,
        90, // initialBalance
      );

    });

  //   it("Should receive and store the funds to thankspay", async function () {
  //     const { thankspay, thankspayedAmount } = await loadFixture(
  //       deployThanksPay
  //     );

  //     expect(await ethers.provider.getBalance(thankspay.address)).to.equal(
  //       thankspayedAmount
  //     );
  //   });

  //   it("Should fail if the unthankspayTime is not in the future", async function () {
  //     // We don't use the fixture here because we want a different deployment
  //     const latestTime = await time.latest();
  //     const ThanksPay = await ethers.getContractFactory("ThanksPay");
  //     await expect(ThanksPay.deploy(latestTime, { value: 1 })).to.be.revertedWith(
  //       "Unthankspay time should be in the future"
  //     );
  //   });
  // });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { thankspay } = await loadFixture(deployOneYearLockFixture);

  //       await expect(thankspay.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { thankspay, unthankspayTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unthankspayTime);

  //       // We use thankspay.connect() to send a transaction from another account
  //       await expect(thankspay.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unthankspayTime has arrived and the owner calls it", async function () {
  //       const { thankspay, unthankspayTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unthankspayTime);

  //       await expect(thankspay.withdraw()).not.to.be.reverted;
  //     });
  //   });

  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { thankspay, unthankspayTime, thankspayedAmount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unthankspayTime);

  //       await expect(thankspay.withdraw())
  //         .to.emit(thankspay, "Withdrawal")
  //         .withArgs(thankspayedAmount, anyValue); // We accept any value as `when` arg
  //     });
  //   });

  //   describe("Transfers", function () {
  //     it("Should transfer the funds to the owner", async function () {
  //       const { thankspay, unthankspayTime, thankspayedAmount, owner } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unthankspayTime);

  //       await expect(thankspay.withdraw()).to.changeEtherBalances(
  //         [owner, thankspay],
  //         [thankspayedAmount, -thankspayedAmount]
  //       );
  //     });
  //   });
  });
});
