import { Contract  } from '@algorandfoundation/tealscript';


export class BlinkContract extends Contract {
    led = GlobalStateKey<string>(); // Company name

    createApplication(
        
      ): void {
        
   this.led.value = "Off";

      }



      turnOn () : void {

   this.led.value = "On";
        
      }

      turnOff () : void {

        this.led.value = "Off";
        
      }

}
