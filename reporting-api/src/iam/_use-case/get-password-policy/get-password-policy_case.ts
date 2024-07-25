import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetPasswordPolicyResponseDTO } from './response.dto';
import { AuthenticationService } from '../../_business/authentification.service';

@Injectable()
export class GetPasswordPolicyUseCase
{
  constructor(
    private readonly authenticationService: AuthenticationService,
    private configService: ConfigService,
  ) {}
  async run(): Promise<GetPasswordPolicyResponseDTO> {
    const realm = this.configService.get('KEYCLOAK_REALM');
    const passwordPolicy = await this.authenticationService.getDomainPolicies(realm);

    const value = passwordPolicy.getValue();

    if (passwordPolicy.isFailure) {
      throw passwordPolicy.getValue() as Error;
    }

    return GetPasswordPolicyResponseDTO.fromModels(value as any);
  }
}
