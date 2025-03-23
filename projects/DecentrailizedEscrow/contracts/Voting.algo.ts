import { Contract } from '@algorandfoundation/tealscript';

export class VotingContract extends Contract {

  // Global state keys
  vote1 = GlobalStateKey<uint64>();
  vote2 = GlobalStateKey<uint64>();
  owner = GlobalStateKey<Address>();
  voteTitle = GlobalStateKey<string>();
  voteDescription = GlobalStateKey<string>();
  votingEndTime = GlobalStateKey<uint64>(); // New key to store vote end time

  // Local state key to track if an address has voted
  localState = LocalStateKey<Address>();

  // Called on contract creation to initialize global states
  createApplication(ownerAddress: Address): void {
    this.vote1.value = 0;
    this.vote2.value = 0
    this.owner.value = ownerAddress;
    this.voteTitle.value = "";
    this.voteDescription.value = "";
    this.votingEndTime.value = 0; // initialize with 0 (meaning no vote is active)
  }

  // Function to create a vote with a title, description, and a duration (in seconds)
  createVote(title: string, description: string, duration: uint64): void {
    // Only the owner can create a vote
    assert(this.txn.sender === this.owner.value);
    this.voteTitle.value = title;
    this.voteDescription.value = description;
    // Set the voting end time to current time plus the duration
    // (Assumes Global.latestTimestamp() returns the current timestamp)
    this.votingEndTime.value = globals.latestTimestamp + duration;
  }

  // Function to cast a vote (option 1 or option 2)
  vote(option: uint64): void {
    // Ensure voting is still active (current time is before votingEndTime)
    assert(globals.latestTimestamp < this.votingEndTime.value);
    // Ensure that the voter hasn't already voted
    assert(!(this.localState(this.txn.sender).value === this.txn.sender));
    
    if (option == 1) {
      this.vote1.value += 1;
      this.localState(this.txn.sender).value = this.txn.sender;
    } else if (option == 2) { // Check for option 2
      this.vote2.value += 1;
      this.localState(this.txn.sender).value = this.txn.sender;
    }
  }

  // Allow a user to opt-in to the application (initialize their local state)
  optInToApplication(): void {
    this.localState(this.txn.sender).value = Address.zeroAddress;
  }
}
