import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SseService } from '../services/sse.service';

@Injectable()
export class XSocketInterceptor implements HttpInterceptor {
  constructor(protected sse: SseService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const socket = this.sse.echo?.socketId();
    if (socket) {
      request = request.clone({
        headers: request.headers.append('X-Socket-Id', socket),
      });
    }

    return next.handle(request);
  }
}
