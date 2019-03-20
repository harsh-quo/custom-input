import { Component, OnInit } from "@angular/core";
import {
  BootstrapInputConfigInterface
} from "./ng-bootstrap-input/ng-bootstrap-input";
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl
} from "@angular/forms";
import { PASSWORD_MESSAGES } from "./ng-bootstrap-input/messages/password/password.messages";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "custom-input";
  appInputConfig: BootstrapInputConfigInterface;
  userForm: FormGroup;
  ngOnInit() {
    this.initialiseForm();
    this.appInputConfig = {
      type: "text",
      label: "password",
      name: "password",
      form: this.userForm,
      validationConfig: {
        required: {
          value: true
        },
        minLength: {
          value: 8,
          message: "Must be eight characters"
        },
        customValidation: {
          value: "password",
          password: passwordValidator()
        }
        // maskArray: this.zipCodeMask,
      }
    };
  }

  initialiseForm() {
    this.userForm = new FormGroup({
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        passwordValidator()
      ])
    });
  }
}

export function passwordValidator(): ValidatorFn {
  let passwordErrorArray: Array<any> = [];
  const lowerCase = new RegExp(/[a-z]/);
  const upperCase = new RegExp(/[A-Z]/);
  const haveNumber = new RegExp(/[0-9]/);
  const specialChar = new RegExp(/[*$@!#%&()^~{}]+/);

  return (control: AbstractControl): { [key: string]: any } | null => {
    passwordErrorArray = [];
    if (control.value) {
      if (!lowerCase.test(control.value) && control.dirty) {
        pushErrorMessage(passwordErrorArray, PASSWORD_MESSAGES.lowerCase);
      }

      if (!upperCase.test(control.value) && control.dirty) {
        pushErrorMessage(passwordErrorArray, PASSWORD_MESSAGES.upperCase);
      }

      if (!haveNumber.test(control.value) && control.dirty) {
        pushErrorMessage(passwordErrorArray, PASSWORD_MESSAGES.number);
      }

      if (!specialChar.test(control.value) && control.dirty) {
        pushErrorMessage(passwordErrorArray, PASSWORD_MESSAGES.specialChar);
      }

      if (passwordErrorArray.length > 0) {
        const errorObject = passwordErrorArray.map(val => val.message);
        return { passwordError: true, messages: errorObject };
      }
    }
    return null;
  };
}

export function pushErrorMessage(errMsgArray: Array<any>, errorMessage: any) {
  if (!errMsgArray.includes(errorMessage)) {
    errMsgArray.push(errorMessage);
  }
}
