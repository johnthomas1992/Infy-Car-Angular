import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { car, carToDelete } from '../Interface/interface';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss']
})
export class CarComponent implements OnInit {
  cars!: Array<car>;
  loader: boolean = false;
  isChecked: boolean = false;
  carToDelete: carToDelete = {
    Number: "",
    Name: "",
    Id: 0
  };
  userForm!: FormGroup;
  errorMessage = '';
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder) { }


  ngOnInit(): void {
   this.fetchCars();
  }

  fetchCars(): void {
    this.loader = true;
    this.apiService.fetchCars().subscribe((cars: Array<car>) => {
      this.cars = cars;
      this.loader = false;
    })
    this.userForm = this.formBuilder.group({
      number: ['', [Validators.required, Validators.maxLength(6), Validators.minLength(6), this.validateCarNumber()]],
      name: ['', [Validators.required]]
    })
  }
  get getControl() {
    return this.userForm.controls;
  }

  trackByFn(index: number, item: car) {
    return item;
  }
  addCar(): void {
    if (this.userForm.valid) {

      this.loader = true;
      let car: car = {
        Number: "",
        Name: ""
      };
      car.Number = this.userForm.value.number;
      car.Name = this.userForm.value.name;
      this.apiService.addCar(car.Number, car.Name).subscribe((item: any) => {
        this.loader = false;
        item.status === 200 ? this.cars.push(car) : alert("API call failed");
        this.userForm.reset();
      }, (error) => {
        console.log(error);
        this.loader = false;
        this.userForm.reset();
        if (error.error === "Error: ConditionalCheckFailedException: The conditional request failed") {
          this.errorMessage = "Number already exist";
          alert("Number already exist");
          
        } else {
          this.errorMessage = "Bad Gateway";
        }
      });
    }
  }

  onChange(number: string, name: string, index: number, event: Event) {
    this.isChecked = (<HTMLInputElement>event.target).checked
    if (this.isChecked) {
      this.carToDelete.Number = number;
      this.carToDelete.Name = name;
      this.carToDelete.Id = index;
    }
  }

  deleteCar() {
    this.loader = true;
    if (this.isChecked) {

      this.apiService.deleteCar(this.carToDelete.Number, this.carToDelete.Name).subscribe((item: any) => {
        this.loader = false;
        item.status === 200 ? this.cars.splice(this.carToDelete.Id, 1) : alert("API call failed");
      }, (error) => {
        this.loader = false;
        if (error.error === "Error: ConditionalCheckFailedException: The conditional request failed") {
          this.errorMessage = "Number not Valid";
        } else {
          this.errorMessage = "Bad Gateway";
        }
      })
    } else {
      this.loader = false;
      alert("Please select an item");
    }
  }

  validateCarNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      let isFirstThreeDigitsAlphabet = false;
      let isLastThreeDigitsNumbers = false;
      if (value.length == 6) {
        isFirstThreeDigitsAlphabet = /^[a-zA-Z()]+$/.test(value.substring(0, 3));
        isLastThreeDigitsNumbers = /^\d+$/.test(value.substring(4, 7));
        const isCarNumberValid = isFirstThreeDigitsAlphabet && isLastThreeDigitsNumbers;
        return !isCarNumberValid ? { valid: false } : null;
      } else {
        return null;
      }
    }
  }

}
