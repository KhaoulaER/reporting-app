import { Injectable } from '@nestjs/common';
import { SendResetRequestDto } from './request.dto';
import { AuthenticationService } from '../../_business/authentification.service';

@Injectable()
export class SendResetCodeUseCase {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async run(data: SendResetRequestDto): Promise<any> {
    try {
      const { clientId, userSessionId, otpType } = data;
      const sendCodeResult = await this.authenticationService.sendCodeForReset(
        clientId,
        userSessionId,
        otpType,
      );

      return sendCodeResult;
    } catch (error) {
      throw error;
    }
  }
}
