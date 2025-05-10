import { Contract  } from '@algorandfoundation/tealscript';


export class TestContract extends Contract {
    sad = GlobalStateKey<string>(); // Company name

    createApplication(
        
      ): void {
        
        
        log("Test DApp created");
      }



      sadMethod (sadn :string) : void {

        this.sad.value == sadn;
        
      }

}
