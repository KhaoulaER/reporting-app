import { Injectable } from '@nestjs/common';
import { RefreshTokenRequestDto } from './request.dto';
import { RefreshTokenResponseDTO } from './response.dto';
import { AuthenticationService } from '../../_business/authentification.service';

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly authenticationService: AuthenticationService) {}
  async run(data: RefreshTokenRequestDto): Promise<RefreshTokenResponseDTO> {
    const tokens = await this.authenticationService.refreshAccessToken(data);

    if (tokens.isFailure) {
      throw tokens.getValue() as Error;
    }

    const value = tokens.getValue();

    return RefreshTokenResponseDTO.fromModels(value as any);
  }
}
