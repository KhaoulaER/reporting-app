import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { KeycloakServiceModule } from 'src/keycloak.module';
import { SharedModule } from 'src/shared/shared.module';
import { IamController } from './iam.controller';
import { LogInUseCase } from './_use-case/login/login.use-case';
import { ValidateTokenoUseCase } from './_use-case/validate-token/validate-token_use-case';
import { ConfigService } from '@nestjs/config';
import { AuthenticationService } from './_business/authentification.service';
import { GetPasswordPolicyUseCase } from './_use-case/get-password-policy/get-password-policy_case';
import { RefreshTokenUseCase } from './_use-case/refresh-token/refreshtoken-use_case';
import { SendResetCodeUseCase } from './_use-case/send-reset-code/send-code.use-case';
import { UpdatePasswordUseCase } from './_use-case/update-password/update-password_case';
import { VerifyUserUseCase } from './_use-case/verify-user/verify-code.use-case';

@Module({
    imports: [SharedModule, KeycloakServiceModule, HttpModule, /*forwardRef(() => UserModule),*/],
  controllers: [IamController],
  providers: [
    LogInUseCase,
    ValidateTokenoUseCase,
    RefreshTokenUseCase,
    //LogOutUseCase,
    GetPasswordPolicyUseCase,
    UpdatePasswordUseCase,
    AuthenticationService,
    ConfigService,
    VerifyUserUseCase,
    SendResetCodeUseCase
  ],
})
export class IamModule {}
