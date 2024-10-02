import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
   /* const request = context.switchToHttp().getRequest();
    console.log('Request Headers:', request.headers);


    
    // Automatically add Bearer token if it's available
    const token = request.headers['authorization'];
    console.log('tokrn from interceptor: ', token)

    if (token) {
      // Modify the request to include the Bearer token
      request.headers['authorization'] = `Bearer ${token.replace('Bearer ', '')}`;

    }

    return next.handle().pipe(
      tap(() => {
        // You can also add logging or other post-request logic here if needed
      }),
    );*/

    const request = context.switchToHttp().getRequest();
    
    const token = request.headers['authorization']?.split(' ')[1];  // Extract Bearer token
    console.log('Token from interceptor: ', token);

    if (token) {
      try {
        // Verify and decode the token (replace 'your-secret' with your actual Keycloak public key or secret)
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token: ', decodedToken);

        if (typeof decodedToken === 'object' && decodedToken !== null) {
          request.user = {
            keycloakId: decodedToken.sub,  // Assuming 'sub' contains the user ID (Keycloak default)
            ...decodedToken,  // Spread the rest of the token fields
          };
        } else {
          console.error('Decoded token is not an object:', decodedToken);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.error('No token found in request headers');
    }

    return next.handle();
  }

}