import { Action } from "@ngrx/store";
import * as AddCarActions from "./cars.actions";


const initialState = {
    cars: [{}]
};

export function carReducer(state = initialState, action: Action) {
    switch (action.type) {
        case AddCarActions.ADD_CAR:
            return {
                ...state,
                cars: [...state.cars, (action as AddCarActions.AddCar).payload]
            };
        case AddCarActions.DELETE_CAR:
            return {
                ...state,
                cars: state.cars.filter((item, index) => {
                    return index != (action as AddCarActions.DeleteCar).payload
                })
            };
        case AddCarActions.FETCH_CARS:
            return {
                ...state,
                cars: [...(action as AddCarActions.FetchCars).payload]
            };
        default:
            return state;
    }
}