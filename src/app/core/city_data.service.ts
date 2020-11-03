import { Injectable } from '@angular/core';
import { _HttpClient } from '@core/http.client';
// import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CityDataService {
  constructor(
    private http: _HttpClient, 
    // public cache: CacheService
    ) {}

  // getCitiesData() {
  //   const url = './assets/data/city-data.json';
  //   return Observable.create((observer) => {
  //     this.cache
  //       .getItem(url)
  //       .catch((error) => {
  //         this.loadCitiesData().subscribe((res) => {
  //           observer.next(res);
  //         });
  //       })
  //       .then((data) => {
  //         if (data) {
  //           observer.next(data);
  //         }
  //       });
  //   });
  // }

  // loadCitiesData() {
  //   const url = './assets/data/city-data.json';
  //   const request = this.http.get(url).pipe(map((res: any) => res));
  //   return this.cache.loadFromObservable(url, request, '', 100 * 365 * 24 * 60 * 60);
  // }
}
