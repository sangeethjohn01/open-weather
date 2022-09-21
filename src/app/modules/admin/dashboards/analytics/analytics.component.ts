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
    forecast: any = "No data available!";
    current: any = "No data available!";
    airPollutionData: any = "No data available!";

    constructor(
        private _AnalyticsService: AnalyticsService,
        public dialogRef: MatDialogRef<ProjectComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ){}

    ngOnInit(): void
    {
        let data = this._AnalyticsService.getWeatherData(this.data.latLong.lat, this.data.latLong.lng);
        let res = {"coord":[50,50],"list":[{"dt":1605182400,"main":{"aqi":1},"components":{"co":201.94053649902344,"no":0.01877197064459324,"no2":0.7711350917816162,"o3":68.66455078125,"so2":0.6407499313354492,"pm2_5":0.5,"pm10":0.540438711643219,"nh3":0.12369127571582794}}]}
        let re1 = {"coord":{"lon":10.99,"lat":44.34},"weather":[{"id":501,"main":"Rain","description":"moderate rain","icon":"10d"}],"base":"stations","main":{"temp":298.48,"feels_like":298.74,"temp_min":297.56,"temp_max":300.05,"pressure":1015,"humidity":64,"sea_level":1015,"grnd_level":933},"visibility":10000,"wind":{"speed":0.62,"deg":349,"gust":1.18},"rain":{"1h":3.16},"clouds":{"all":100},"dt":1661870592,"sys":{"type":2,"id":2075663,"country":"IT","sunrise":1661834187,"sunset":1661882248},"timezone":7200,"id":3163858,"name":"Zocca","cod":200}
        this.airPollutionData = res["list"] ? res["list"][0] ? res["list"][0]["components"] : res["list"][0]["components"] : this.airPollutionData;
        console.log("---data", data);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
