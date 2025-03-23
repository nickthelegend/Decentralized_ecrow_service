import { Contract } from '@algorandfoundation/tealscript';



export class VerifyContract extends Contract {

    isVerified = GlobalStateKey<boolean>();


    private opup(): void {
		sendAppCall({
			onCompletion: OnCompletion.DeleteApplication,
			approvalProgram: hex('0a8101'),
			clearStateProgram: hex('0a8101')
		});
	}

    createApplication(): void {
        this.isVerified.value = false;
        

      }

      verifyTheContract():void{

        this.opup();
		this.opup();
		this.opup();


        ed25519Verify(
            'sad',
            "168C58B0A836250F67E993E49B79ACD6AB6D68339DEE88F6FA5D43A6CAECDE9F3E7A194DDD8660DA8C915D7D5B15EAB0128A8D4EAA5A19A8D8D5DCDCE11F520D",
            "E3B9BC413FDDD644346EC43615DCD34165F7EE2A93166AD45A0B9D845F03F6EE"
          );

          this.isVerified.value = true;
      }

}