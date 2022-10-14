import { Action } from "@ngrx/store";
import { car } from "../../Interface/interface";

export const ADD_CAR = "ADD_CAR";
export const DELETE_CAR = "DELETE_CAR";
export const FETCH_CARS = "FETCH_CARS";

export class AddCar implements Action {
    readonly type: string = ADD_CAR;
    constructor(public payload: car) { }
}

export class DeleteCar implements Action {
    readonly type: string = DELETE_CAR;
    constructor(public payload: number) { }
}

export class FetchCars implements Action {
    readonly type: string = FETCH_CARS;
    constructor(public payload: Array<car>) { }
}