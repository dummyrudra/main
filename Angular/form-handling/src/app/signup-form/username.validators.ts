import { AbstractControl,ValidationErrors } from "@angular/forms";

export class UsernameValidators{
  static canNotContainSpace(control:AbstractControl): ValidationErrors | null{
        
        if((control.value as string).indexOf(" ")>-1) return {canNotContainSpace:true}
        return null
    }
  
}