import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { LogInRequestDto } from './request.dto';
import { AuthenticationService } from '../../_business/authentification.service';

@Injectable()
export class LogInUseCase {
  constructor(private readonly authenticationService: AuthenticationService) {}
  async run(data: LogInRequestDto): Promise<any> {
    const logInResult = await this.authenticationService.login(data);

    console.log('logInResult', logInResult);

    if (logInResult.isFailure) {
      const errorCode = logInResult.error.code;
      const errorMessage = logInResult.error.message;

      switch (errorCode) {
        case '401':
          throw new UnauthorizedException(errorMessage);
        case '404':
          throw new NotFoundException(errorMessage);
        default:
          throw new Error(errorMessage);
      }
    }

    // Format response for frontend
    const response = logInResult.getValue();
    const userId = response.userId;
    const email = response.email;
    const groups = response.groups || [];
    const roles = response.roles || [];

    return {
      userId,
      email,
      groups,
      roles,
      access_token: response.access_token,
      refresh_token: response.refresh_token,
      authLevel: response.authLevel,
    };
  }
}
