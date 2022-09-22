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
    dataLoaded: boolean = true; // flag for checking api data loaded completely or not

    constructor(
        private _AnalyticsService: AnalyticsService,
        public dialogRef: MatDialogRef<ProjectComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ){}

    ngOnInit(): void
    {
        // api call to get weather related data, using forkJoin because all three api's has same input
        this._AnalyticsService.getWeatherData(this.data.latLong.lat, this.data.latLong.lng).subscribe(resData=>{
            try {
                this.dataLoaded = false;

                let forecast = resData[0];
                let current = resData[1];
                let airPollutionData = resData[2];
                
                this.forecast = forecast["city"];
                this.current = {};
                this.current["weather"] = current["weather"][0];
                this.current["main"] = current["main"];
                this.airPollutionData = airPollutionData["list"][0]["components"];
            } catch (error) {
                this.dataLoaded = false;
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
