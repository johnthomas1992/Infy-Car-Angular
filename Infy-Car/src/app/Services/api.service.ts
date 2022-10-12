import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { car } from '../Interface/interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url: string = "https://5vlquaf0qc.execute-api.ap-south-1.amazonaws.com/mock-stage/car";
  constructor(private http: HttpClient) { }

  /**
   * Fetches car deatils from DB
   */
  fetchCars(): Observable<Array<car>> {
    return this.http.get<Array<car>>(this.url);
  }

  /**
   * Add car details to DB
   * @param number 
   * @param name 
   * @returns 
   */
  addCar(number: string, name: string): Observable<any> {
    let body = {
      "Number": number,
      "Name": name
    }
    return this.http.post(this.url, body, { observe: 'response' });
  }

  /**
   * Removes car details from DB
   * @param number 
   * @param name 
   * @returns 
   */
  deleteCar(number: string, name: string): Observable<any> {
    let body = {
      "Number": number,
      "Name": name
    }
    return this.http.delete(this.url, { observe: 'response', body: body });
  }
}
