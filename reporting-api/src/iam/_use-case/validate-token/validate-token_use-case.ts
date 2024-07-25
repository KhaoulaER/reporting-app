import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { ValidateTokenRequestDto } from './request.dto';
import { ValidateTokenResponseDTO } from './response.dto';
import { AuthenticationService } from '../../_business/authentification.service';

@Injectable()
export class ValidateTokenoUseCase {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async run(data: ValidateTokenRequestDto): Promise<ValidateTokenResponseDTO> {
    const result = await this.authenticationService.validateToken(data);
    const value = result.getValue();
    if (result.isFailure) {
      throw new InternalServerErrorException(result.getValue() as Error);
    }
    return ValidateTokenResponseDTO.fromModel(value);
  }
}
