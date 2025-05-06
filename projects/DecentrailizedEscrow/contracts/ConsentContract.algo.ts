import { Contract,  } from '@algorandfoundation/tealscript';

export class ConsentContract extends Contract {

  // Global state keys
  consentTitle = GlobalStateKey<string>();
  description = GlobalStateKey<string>();
  organization = GlobalStateKey<string>();
  expirationDate = GlobalStateKey<uint64>();
  consentHash = GlobalStateKey<string>();
  consentDataBox = BoxKey<string>({key:'consentData',dynamicSize: true});

  status = GlobalStateKey<string>(); // Possible values: 'Active', 'Revoked', 'Expired'
  owner = GlobalStateKey<Address>();


  // Called on contract creation to initialize global states
  createApplication(ownerAddress: Address): void {
    this.consentTitle.value = "";
    this.description.value = "";
    this.organization.value = "";
    this.expirationDate.value = 0;
    this.consentHash.value = "";
    this.status.value = "Active";
    this.owner.value = ownerAddress;

  }
  createBox(): void {
    this.consentDataBox.create(400)

  }
  // Function to create a consent with necessary details
  createConsent(
    title: string,
    description: string,
    organization: string,
    duration: uint64,
    consentHash: string,
    consetData: string,
  ): void {
    // Only the owner can create a consent
    assert(this.txn.sender === this.owner.value);
    this.consentTitle.value = title;
    this.description.value = description;
    this.organization.value = organization;
    // Set the expiration date to current time plus the duration
    this.expirationDate.value = globals.latestTimestamp + duration;
    this.consentHash.value = consentHash;
    this.status.value = "Active";


    this.consentDataBox.value = consetData;
  }

  // Function to revoke the consent
  revokeConsent(): void {
    // Only the owner can revoke the consent
    assert(this.txn.sender === this.owner.value);
    // Ensure the consent is currently active
    assert(this.status.value === "Active");
    this.status.value = "Revoked";
  }

  // Function to extend the consent's expiration date
  extendConsent(duration: uint64): void {
    // Only the owner can extend the consent
    assert(this.txn.sender === this.owner.value);
    // Ensure the consent is currently active
    assert(this.status.value === "Active");
    // Extend the expiration date by the specified duration
    this.expirationDate.value += duration;
  }

  // Function to check and update the status based on expiration
  updateStatus(): void {
    // If the current time is past the expiration date and status is active, mark as expired
    if (globals.latestTimestamp > this.expirationDate.value && this.status.value === "Active") {
      this.status.value = "Expired";
    }
  }

  
}
