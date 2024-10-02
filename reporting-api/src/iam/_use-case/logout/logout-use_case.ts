import { Injectable } from '@nestjs/common';
import { LogOutRequestDto } from './request.dto';
//import { UpdateUserAttributesUseCase } from 'src/modules/user/_api/_use_cases/update-user-attributes/update-user-attributes.use-case';
import { AuthenticationService } from '../../_business/authentification.service';

@Injectable()
export class LogOutUseCase {
    constructor(
    private readonly authenticationService: AuthenticationService,
    //private readonly updateUserAttributesUseCase: UpdateUserAttributesUseCase,
     ) {}
    /*async run(data: { body: LogOutRequestDto; id: string }): Promise<any> {
//     //reset user attributes
   /* await this.updateUserAttributesUseCase.run({
         id: data.id,
         input: { attribut: 'acr', value: 'null' },
    });*/
   /* const logoutResult = await this.authenticationService.logout(data.body);
    if (logoutResult.isFailure) {
     throw logoutResult.getValue() as Error;
    }
     const value = logoutResult.getValue();
     return value;
   }*/
     async run(data: { body: LogOutRequestDto; id: string }): Promise<any> {
      try {
        const logoutResult = await this.authenticationService.logout(data.body);
      
        // Handle failure
        if (logoutResult.isFailure) {
          const error = logoutResult.error || logoutResult.getValue();
          console.error('Error during logout:', error); // Log the error
          throw new Error(error); // Throw the error from the Result object
        }
      
        // Return successful result
        const value = logoutResult.getValue();
        return value;
      } catch (err) {
        console.error('Error in logout use case:', err); // Log error in use case
        throw err;
      }
    }
    
    
 }
