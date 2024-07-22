import { time, loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import { expect } from 'chai'
import hre from "hardhat";

describe('Lock', () => {
    async function deployOneYearLockFixture() {
        const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
        const ONE_GWEI = 1_000_000_000;

        const lockedAmount = ONE_GWEI;
        const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const Lock = await hre.ethers.getContractFactory("Lock");
        const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

        return { lock, unlockTime, lockedAmount, owner, otherAccount };
    }

    describe('Deployment', () => {
        it('Should set the right unlockTime', async () => {
            const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture)

            expect(await lock.unlockTime()).to.equal(unlockTime);
        })
    })
})