const { ethers, upgrades } = require("hardhat");

async function main() {
  const PROXY_ADDRESS = "0x33F4a2E02975Fe83516d122F4DA807f71836aAA8"; 

  console.log("Upgrading ShipmentTracker to V2...");

  const ShipmentTrackerV2 = await ethers.getContractFactory("ShipmentTrackerV2");
  
  // This triggers the upgrade
  const upgraded = await upgrades.upgradeProxy(PROXY_ADDRESS, ShipmentTrackerV2);

  console.log("Waiting for transaction confirmation...");

  // Version-proof waiting logic
  if (upgraded.deploymentTransaction) {
      // Ethers v6
      await upgraded.deploymentTransaction().wait();
  } else if (upgraded.deployTransaction) {
      // Ethers v5
      await upgraded.deployTransaction.wait();
  }

  const finalAddress = await upgraded.getAddress ? await upgraded.getAddress() : upgraded.address;
  
  console.log("✅ ShipmentTracker successfully upgraded to V2!");
  console.log("Proxy Address:", finalAddress);
}

main().catch((error) => {
  console.error("Upgrade failed:", error);
  process.exitCode = 1;
});