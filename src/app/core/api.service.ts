import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api';

  getFacilityWeek(): Observable<any> {
    return this.http.get(`${this.base}/facility/me/week`);
  }

  getBasket(): Observable<any> {
    return this.http.get(`${this.base}/facility/me/basket`);
  }

  postBasket(body: Record<string, unknown>): Observable<any> {
    return this.http.post(`${this.base}/facility/me/basket`, body);
  }

  getImpact(): Observable<any> {
    return this.http.get(`${this.base}/impact/me`);
  }

  getFoodInventory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/partner/food/inventory`);
  }

  patchInventory(body: Record<string, unknown>): Observable<any[]> {
    return this.http.patch<any[]>(`${this.base}/partner/food/inventory`, body);
  }

  postInventory(body: Record<string, unknown>): Observable<any[]> {
    return this.http.post<any[]>(`${this.base}/partner/food/inventory`, body);
  }

  getFoodOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/partner/food/orders`);
  }

  getFoodForecast(): Observable<any> {
    return this.http.get(`${this.base}/partner/food/forecast`);
  }

  getFoodDashboard(): Observable<any> {
    return this.http.get(`${this.base}/partner/food/dashboard`);
  }

  getFoodPayouts(): Observable<any> {
    return this.http.get(`${this.base}/partner/food/payouts`);
  }

  getTransportRoutes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/partner/transport/routes`);
  }

  getRoute(id: string): Observable<any> {
    return this.http.get(`${this.base}/partner/transport/routes/${id}`);
  }

  postRoute(id: string, body: Record<string, unknown>): Observable<any> {
    return this.http.post(`${this.base}/partner/transport/routes/${id}`, body);
  }

  getTransportEarnings(): Observable<any> {
    return this.http.get(`${this.base}/partner/transport/earnings`);
  }

  getTransportFleet(): Observable<any> {
    return this.http.get(`${this.base}/partner/transport/fleet`);
  }

  getTransportDrivers(): Observable<any> {
    return this.http.get(`${this.base}/partner/transport/drivers`);
  }

  recommendBasket(): Observable<any> {
    return this.http.post(`${this.base}/ai/recommend-basket`, {});
  }
}
