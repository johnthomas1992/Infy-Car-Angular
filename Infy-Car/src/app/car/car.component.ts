import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { car, carToDelete } from '../Interface/interface';
import { ApiService } from '../Services/api.service';
import * as carActions from "../car/Store/cars.actions";

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
    private formBuilder: FormBuilder,
    private store: Store<{ cars: { cars: Array<car> } }>
  ) { }


  ngOnInit(): void {
    this.store.select('cars').subscribe(item => this.cars = item.cars);
    this.fetchCars();
  }

  /**
   * Function to fetch available car data from DB
   */
  fetchCars(): void {
    this.loader = true;
    this.apiService.fetchCars().subscribe((cars: Array<car>) => {
      this.store.dispatch(new carActions.FetchCars(cars));
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

  /**
   * Function to track html for-loop
   * @param index 
   * @param item 
   * @returns 
   */
  trackByFn(index: number, item: car) {
    return item;
  }

  /**
   * Function to add new car details
   */
  addCar(): void {
    if (this.userForm.valid) {

      this.loader = true;
      let carItem: car = {
        Number: "",
        Name: ""
      };
      carItem.Number = this.userForm.value.number;
      carItem.Name = this.userForm.value.name;
      this.apiService.addCar(carItem.Number, carItem.Name).subscribe((item: any) => {
        this.loader = false;
        item.status === 200 ? this.store.dispatch(new carActions.AddCar(carItem)) : alert("API call failed");
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

  /**
   * Function to detect checkbox selection
   * @param number 
   * @param name 
   * @param index 
   * @param event 
   */
  onChange(number: string, name: string, index: number, event: Event) {
    this.isChecked = (<HTMLInputElement>event.target).checked
    if (this.isChecked) {
      this.carToDelete.Number = number;
      this.carToDelete.Name = name;
      this.carToDelete.Id = index;
    }
  }

  /**
   * Function to remove car details from DB
   */
  deleteCar() {
    this.loader = true;
    if (this.isChecked) {

      this.apiService.deleteCar(this.carToDelete.Number, this.carToDelete.Name).subscribe((item: any) => {
        this.loader = false;
        item.status === 200 ? this.store.dispatch(new carActions.DeleteCar(this.carToDelete.Id)) : alert("API call failed");
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

  /**
   * Custom validator for validating Number plate format
   * @returns 
   */
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
