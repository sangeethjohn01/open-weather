import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from './project.service';
import { AnalyticsComponent } from '../analytics/analytics.component';

declare let google: any;
export interface DialogData {
    latLong: any;
}

@Component({
    selector       : 'project',
    templateUrl    : './project.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectComponent implements OnDestroy, AfterViewInit
{
    constructor( 
        private _projectService: ProjectService,
        private _snackBar: MatSnackBar,
        public dialog: MatDialog 
    ){}

    ngAfterViewInit(): void{
        const map = new google.maps.Map(
            document.getElementById("map"), 
            {
                center: { lat: 57.7089, lng: 11.9746 },
                zoom: 8,
            }
        )

        // Configure the click listener.
        map.addListener("click", (mapsMouseEvent) => {
            let latlongCordinates = JSON.stringify(mapsMouseEvent.latLng);
            const marker = new google.maps.Marker({
                position: JSON.parse(latlongCordinates),
                map: map,
            });
            this._snackBar.open("Marker is set, Click on marker to see the weather status", "OK", {
                duration: 5000
            });
            google.maps.event.addListener(marker, 'click', (evt) => {
                const latLong = JSON.parse(JSON.stringify(evt.latLng));
                this.openDialog(latLong);
            });
        });

         // Create the search box and link it to the UI element.
        const input = document.getElementById("pac-input");
        const searchBox = new google.maps.places.SearchBox(input);

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener("bounds_changed", () => {
            searchBox.setBounds(map.getBounds());
        });

        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener("places_changed", () => {
            const places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }

            // For each place, get the icon, name and location.
            const bounds = new google.maps.LatLngBounds();

            places.forEach((place) => {
            if (!place.geometry || !place.geometry.location) {
                console.log("Returned place contains no geometry");
                return;
            }

            const icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25),
            };

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
            });
            map.fitBounds(bounds);
        });
    }

    // Dialog box to show all the weather related data
    openDialog(latLong): void {
        const dialogRef = this.dialog.open(AnalyticsComponent, {
          data: {latLong: latLong},
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
    }

    ngOnDestroy(): void{}
}
