import { environment } from './../environments/environment';
import { Component, OnInit } from '@angular/core';
import { SignalRService } from './services/signal-r.service';
import { HttpClient } from '@angular/common/http';
import { IAnimal } from './interfaces/i-animal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    public signalRService: SignalRService,
    private http: HttpClient) { }

  ngOnInit() {
    this.signalRService.startZooConnection();
    this.signalRService.addZooTransferChartDataListener();
    this.signalRService.addBroadcastZooDataListener();
    this.startHttpRequest();
  }
  get animals(): IAnimal[] {
    return this.signalRService.zooData;
  }

  private startHttpRequest = () => {
    const url = environment.zooServiceUrl;
    this.http.get(`${url}/api/zoo`)
      .subscribe(res => {
        console.log('trigger request', res);
      });
  }

  feedAnimal(animal: IAnimal) {
    const increasedHealthValue = this.getRandomInt(10, 25);
    const temp = animal.currentAnimalHealthNumber + increasedHealthValue;
    animal.currentAnimalHealthNumber = temp > 100 ? 100 : temp;
    this.signalRService.broadcastZooData();
  }
  private getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
