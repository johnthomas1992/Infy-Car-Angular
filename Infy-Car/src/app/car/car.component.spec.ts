import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CarComponent } from './car.component';
import { ApiService } from '../Services/api.service';
import { car } from '../Interface/interface';
import { Observable, of, throwError } from 'rxjs';

class MockCarServiceStub {
  
  fetchCars(): Observable<Array<car>> {
      let car$ = of(mockCarJson);
      return car$;
  }
  addCar(number: string, name: string): Observable<any> {
    let error$ = of({status: 400, body: {error:'Error: ConditionalCheckFailedException: The conditional request failed'}}) 
    //of('Error: ConditionalCheckFailedException: The conditional request failed');
    return error$ ;
  }
}

const mockCarJson = [
  {
      "Number": "CMS971",
      "Name": "Jane"
  },
  {
      "Number": "QUI375",
      "Name": "John"
  }
];
describe('CarComponent', () => {
  let component: CarComponent;
  let fixture: ComponentFixture<CarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ CarComponent ],
      providers: [
        { provide: ApiService, useClass: MockCarServiceStub }]
      
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create car component', () => {
    expect(component).toBeTruthy();
  });

  it('should allow only unique car numbers', () => {
    component.userForm.patchValue({number: 'CMS971'});
    component.userForm.patchValue({name: 'Jane'});
    let service = fixture.debugElement.injector.get(ApiService);
    spyOn(service,"addCar").and.returnValue(throwError({status: 400, error :'Error: ConditionalCheckFailedException: The conditional request failed'}));
    component.addCar();
    expect(component.errorMessage).toBe("Number already exist");
  });
  it('should throw error when car number is 123asd', () => {
    component.userForm.patchValue({number: '123asd'});
    expect(component.userForm.controls['number'].status).toBe('INVALID');
  });
  it('should throw error when car number is asd1w3', () => {
    component.userForm.patchValue({number: 'asd1w3'});
    expect(component.userForm.controls['number'].status).toBe('INVALID');
  });

  it('should not show error when car number is asd123', () => {
    component.userForm.patchValue({number: 'asd123'});
    expect(component.userForm.controls['number'].status).toBe('VALID');
  });
});
