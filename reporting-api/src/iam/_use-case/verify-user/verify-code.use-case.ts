import { Injectable, NotFoundException } from '@nestjs/common';
import { VerifyUserRequestDto } from './request.dto';
import { AuthenticationService } from '../../_business/authentification.service';

@Injectable()
export class VerifyUserUseCase {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async run(data: VerifyUserRequestDto): Promise<any> {
    const verifyCodeResult = await this.authenticationService.verifyUser(
      data.search,
    );

    if (verifyCodeResult.isFailure) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return verifyCodeResult;
  }
}
