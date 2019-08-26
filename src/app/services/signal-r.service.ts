import { IAnimal } from './../interfaces/i-animal';
import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  public zooData: IAnimal[];
  private zooHubConnection: signalR.HubConnection;

  public startZooConnection = () => {
    const url = environment.zooServiceUrl;
    this.zooHubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${url}/zoo`)
      .build();

    this.zooHubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  public addZooTransferChartDataListener = () => {
    this.zooHubConnection.on('transferzoodata', (zooData) => {
      this.zooData = zooData;
      console.log(zooData);
    });
  }


  public broadcastZooData = () => {
    this.zooHubConnection.invoke('broadcastzoodata', this.zooData)
      .catch(err => {
        console.error(err);
      });
  }

  public addBroadcastZooDataListener = () => {
    this.zooHubConnection.on('broadcastzoodata', (data) => {
      this.zooData = data;
    });
  }
}
