import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any>
    {
        return this._httpClient.get('api/dashboards/analytics').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    /**
     * Get weather data
     */
     getWeatherData(lat, long) {
        let forecastApi = this._httpClient.get("https://api.openweathermap.org/data/2.5/forecast?lat="+ lat +"&lon="+ long +"&appid=9c7f51ad29e927939e5411b3191d4137");
        let weatherApi = this._httpClient.get("https://api.openweathermap.org/data/2.5/weather?lat="+ lat +"&lon="+ long +"&appid=9c7f51ad29e927939e5411b3191d4137");
        let airPollutionApi = this._httpClient.get("http://api.openweathermap.org/data/2.5/air_pollution?lat="+ lat +"&lon="+ long +"&appid=9c7f51ad29e927939e5411b3191d4137");
        console.log(forecastApi);
        console.log(weatherApi);
        console.log(airPollutionApi);
        let res = forkJoin([forecastApi, weatherApi, airPollutionApi]);
        return res
        // return forkJoin([forecastApi, weatherApi, airPollutionApi]);
      }
}
