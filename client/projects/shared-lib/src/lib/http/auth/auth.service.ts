import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  pipe,
  Subject,
  Subscription,
  throwError,
  timer,
} from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { HttpService } from '../http.service';
import {
  AuthChangePasswordInput,
  AuthLoginInput,
  AuthLogoutResponse,
  AuthResponse,
  AuthRoleResponse,
  AuthWhoAmIResponse,
} from './auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  error: Observable<HttpErrorResponse>;
  private error$ = new Subject<HttpErrorResponse>();
  private isAuthenticated$ = new BehaviorSubject<null | boolean>(null);
  private isExpired$ = new Subject<boolean>();
  private refreshTokenSubscription?: Subscription;
  private readonly refreshTokenSafeGapMs = 5000;

  constructor(private httpService: HttpService) {
    this.error = this.error$.asObservable();
    this.verify();
  }

  logIn(input: AuthLoginInput): Observable<AuthResponse> {
    return this.httpService
      .post<AuthResponse>('/api/auth/login', input)
      .pipe(this.setIsAuthenticatedPipe(), this.setRefreshTokenTimerPipe());
  }

  logOut() {
    return this.httpService
      .post<AuthLogoutResponse>('/api/auth/logout', null)
      .pipe(
        tap(() => {
          this.setUnauthenticated();
        }),
      );
  }

  whoAmI() {
    return this.httpService
      .post<AuthWhoAmIResponse>('/api/auth/whoami', null)
      .pipe(this.setIsAuthenticatedPipe(), this.setRefreshTokenTimerPipe());
  }

  role() {
    return this.httpService.post<AuthRoleResponse>('/api/auth/role', null);
  }

  isAuthenticated() {
    return this.isAuthenticated$.asObservable();
  }

  isExpired() {
    return this.isExpired$.asObservable();
  }

  changePassword(input: AuthChangePasswordInput) {
    return this.httpService
      .post<AuthLogoutResponse>('/api/auth/pwd-change', input)
      .pipe(
        tap(() => {
          this.setUnauthenticated();
        }),
      );
  }

  private refresh() {
    return (
      this.httpService
        .post<AuthResponse>('/api/auth/refresh', null)
        // sends `setToExpired` as true
        // so in error handler `isExpired$` can be set to true
        .pipe(
          this.setIsAuthenticatedPipe(true),
          this.setRefreshTokenTimerPipe(),
        )
    );
  }

  private verify() {
    this.whoAmI()
      .pipe(take(1))
      .subscribe({
        // error is bubbling up through zone.js to nest
        // this empty error handler supress it
        error: () => {},
      });
  }

  private setAuthenticated() {
    this.toggleIsAuthenticated(true);
    this.isExpired$.next(false);
  }

  private setUnauthenticated() {
    this.cancelRefreshTokenTimer();
    this.toggleIsAuthenticated(false);
  }

  private toggleIsAuthenticated(toNewValue: boolean) {
    if (this.isAuthenticated$.value !== toNewValue) {
      this.isAuthenticated$.next(toNewValue);
    }
  }

  private setIsAuthenticatedPipe<T>(setToExpired = false) {
    return pipe(
      catchError((err: HttpErrorResponse) => {
        this.error$.next(err);
        return this.isAuthenticatedPipeErrorHandler(err, setToExpired);
      }),
      tap<T>(() => {
        this.setAuthenticated();
      }),
    );
  }

  private isAuthenticatedPipeErrorHandler(
    err: HttpErrorResponse,
    setToExpired: boolean,
  ) {
    if (err.status && err.status === 401) {
      this.setUnauthenticated();
      if (setToExpired) {
        this.isExpired$.next(true);
      }
    }
    return throwError(() => err);
  }

  private setRefreshTokenTimerPipe<T>() {
    return pipe(
      tap<T>((resp: unknown) => {
        const { expiresInMs } = resp as AuthResponse | AuthWhoAmIResponse;
        this.setRefreshTokenTimer(expiresInMs);
      }),
    );
  }

  private cancelRefreshTokenTimer() {
    if (
      this.refreshTokenSubscription &&
      this.refreshTokenSubscription.unsubscribe
    ) {
      this.refreshTokenSubscription.unsubscribe();
    }
    this.refreshTokenSubscription = undefined;
  }

  private setRefreshTokenTimer(expiresInMs: number) {
    this.cancelRefreshTokenTimer();
    const timerDelay =
      expiresInMs > this.refreshTokenSafeGapMs
        ? expiresInMs - this.refreshTokenSafeGapMs
        : 0;

    this.refreshTokenSubscription = this.getAuthExpiryTimer(
      timerDelay,
    ).subscribe(() => {
      this.refresh().pipe(take(1)).subscribe();
    });
  }

  private getAuthExpiryTimer(initialDelay: number) {
    return timer(initialDelay);
  }
}
