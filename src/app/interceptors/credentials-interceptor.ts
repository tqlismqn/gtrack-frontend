import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DEMO_MODE } from '../demo.config';

const IS_DEMO_MODE = environment.demoMode || DEMO_MODE;

@Injectable()
export class WithCredentialsInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (!IS_DEMO_MODE) {
      request = request.clone({
        withCredentials: true,
      });
    }

    return next.handle(request);
  }
}
