import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData, ProjectComponent } from '../project/project.component';
import { AnalyticsService } from './analytics.service';

@Component({
    selector       : 'analytics',
    templateUrl    : './analytics.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsComponent implements OnInit
{
    forecast: any;
    current: any;
    airPollutionData: any;

    constructor(
        private _AnalyticsService: AnalyticsService,
        public dialogRef: MatDialogRef<ProjectComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ){}

    ngOnInit(): void
    {
        // api call to get weather related data, using forkJoin because all three api's has same input
        this._AnalyticsService.getWeatherData(this.data.latLong.lat, this.data.latLong.lng).subscribe(resData=>{
            console.log(resData[0]);
            console.log(resData[1]);
            console.log(resData[2]);

            let forecast = {"cod":"200","message":0,"cnt":40,"city":{"id":2714327,"name":"Floby","coord":{"lat":58.0646,"lon":13.46},"country":"SE","population":1544,"timezone":7200,"sunrise":1663822227,"sunset":1663866452}}

            let current = {"coord":{"lon":10.99,"lat":44.34},"weather":[{"id":501,"main":"Rain","description":"moderate rain","icon":"10d"}],"base":"stations","main":{"temp":298.48,"feels_like":298.74,"temp_min":297.56,"temp_max":300.05,"pressure":1015,"humidity":64,"sea_level":1015,"grnd_level":933},"visibility":10000,"wind":{"speed":0.62,"deg":349,"gust":1.18},"rain":{"1h":3.16},"clouds":{"all":100},"dt":1661870592,"sys":{"type":2,"id":2075663,"country":"IT","sunrise":1661834187,"sunset":1661882248},"timezone":7200,"id":3163858,"name":"Zocca","cod":200}

            let airPollutionData = {"coord":[50,50],"list":[{"dt":1605182400,"main":{"aqi":1},"components":{"co":201.94053649902344,"no":0.01877197064459324,"no2":0.7711350917816162,"o3":68.66455078125,"so2":0.6407499313354492,"pm2_5":0.5,"pm10":0.540438711643219,"nh3":0.12369127571582794}}]}

            try {
                this.forecast = forecast["city"];
                this.current = {};
                this.current["weather"] = current["weather"][0];
                this.current["main"] = current["main"];
                this.airPollutionData = airPollutionData["list"][0]["components"];
            } catch (error) {
                console.log("Something wrong happened!") 
            }
        })
    }

    // function to close  the dialog box on click of close button
    onNoClick(): void {
        this.dialogRef.close();
    }

    // destroy all the variables, in order to stop the memory leak
    ngOnDestroy(): void{
        this.forecast = undefined;
        this.current = undefined;
        this.airPollutionData = undefined;
    }
}
