import { Injectable } from '@nestjs/common';
import { AuthenticationService } from '../../_business/authentification.service';
import { UpdatePasswordRequestDto } from './request.dto';

@Injectable()
export class UpdatePasswordUseCase {
  constructor(private readonly authenticationService: AuthenticationService) {}
  async run(data: UpdatePasswordRequestDto): Promise<any> {
    const updatePassowrd =
      await this.authenticationService.updatePassoword(data);

    if (updatePassowrd.isFailure) {
      throw new Error('Failed to update the password');
      // } else {
      //   const decodedToken: any = jwt_decode(data.token);

      //   const updatePreferenceData: any = {
      //     userId: decodedToken.sub as string,
      //     lastPasswordUpdate: new Date().toISOString(),
      //   };

      //   const updatePreferenceResult = await this.updatePreferenceUseCase.run(
      //     updatePreferenceData,
      //   );
    }

    return updatePassowrd.getValue();
  }
}
