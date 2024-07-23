// We import Chai to use its asserting functions here.
import {expect} from "../chai-setup"
import {Contract} from 'ethers'
// we import our utilities
import {setupUsers, setupUser} from '../setup'
// We import the hardhat environment field we are planning to use
import {ethers, deployments, getNamedAccounts, getUnnamedAccounts} from 'hardhat'

// we create a stup function that can be called by every test and setup variable for easy to read tests
async function setup () {
  // it first ensure the deployment is executed and reset (use of evm_snaphost for fast test)
  await deployments.fixture(["Token"])

  // we get an instantiated contract in the form of a ethers.js Contract instance:
  const contracts: { [contractName: string]: Contract } = {
    Token: (await ethers.getContract('Token')) as Contract,
  }

  // we get the tokenOwner
  const {deployer} = await getNamedAccounts()
  const tokenOwner = deployer
  // get fet unnamedAccounts (which are basically all accounts not named in the config, useful for tests as you can be sure they do not have been given token for example)
  // we then use the utilities function to generate user object/
  // These object allow you to write things like `users[0].Token.transfer(....)`
  const users = await setupUsers(await getUnnamedAccounts(), contracts)

  // finally we return the whole object (including the tokenOwner setup as a User object)
  return {
    Token: contracts.Token,
    users,
    tokenOwner: await setupUser(tokenOwner, contracts),
  }
}

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("Token contract", function() {

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // Expect receives a value, and wraps it in an Assertion object. These
      // objects have a lot of utility methods to assert values.

      // before the test, we call the fixture function.
      // while mocha have hooks to perform these automatically, they force you to declare the variable in greater scope which can introduce subttle errors
      // as such we prefers to have the setup called right at the beginning of the test. this also allow you to name it accordingly for easier to read tests.
      const {Token} = await setup()

      // This test expects the owner variable stored in the contract to be equal to our configured owner
      const {deployer} = await getNamedAccounts()
      expect(await Token.owner()).to.equal(deployer)
    })

    it("Should assign the total supply of tokens to the owner", async function () {
      const {Token, tokenOwner} = await setup()
      const ownerBalance = await Token.balanceOf(tokenOwner.address)
      expect(await Token.totalSupply()).to.equal(ownerBalance)
    })
  })

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const {Token, users, tokenOwner} = await setup()
      // Transfer 50 tokens from owner to users[0]
      await tokenOwner.Token.transfer(users[0].address, 50)
      const users0Balance = await Token.balanceOf(users[0].address)
      expect(users0Balance).to.equal(50)
    })

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const {Token, users, tokenOwner} = await setup()
      const initialOwnerBalance = await Token.balanceOf(tokenOwner.address)

      // Try to send 1 token from users[0] (0 tokens) to owner (1000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(users[0].Token.transfer(tokenOwner.address, 1)
      ).to.be.revertedWith("Not enough tokens")

      // Owner balance shouldn't have changed.
      expect(await Token.balanceOf(tokenOwner.address)).to.equal(
        initialOwnerBalance
      )
    })
  })
})