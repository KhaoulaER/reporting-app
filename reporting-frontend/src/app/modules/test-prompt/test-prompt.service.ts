import { Injectable } from '@angular/core';

import MistralClient from '@mistralai/mistralai'
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestPromptService {

  private apiKey = "YYYYYYYYYYYYYYYYYYYYYYYYYYYYY"
  private client = new MistralClient(this.apiKey)
  constructor() {
   
   }

   testPrompt(norme: string, pc: string | undefined, constat: string[] | []): Observable<{ recommandation: string }> {
    return from(this.client.chat({
      model: 'mistral-large-latest',
      messages: [
        { role: 'system', content: `Dans le cadre d'un audit grc pour la norme: ${norme}, précisément point de contrôle ${pc}, on a donné les constats ${constat}.` },
        { role: 'user', content: `Donne moi des recommandations pour l'amélioration de la conformité à la norme ${norme} pour le point de contrôle ${pc} selon le constat ${constat}. nous désirons des réponses sans introductions et sans caractères spéciaux seulement juste une liste des recommandations classifiées en court terme, long terme et moyen terme, et au debut de chaque recommandation un point. ` },
      ],
      temperature: 0.5
    }).then(chatResponse => ({ recommandation: chatResponse.choices[0].message.content }))
      .catch(error => {
        console.error('Error:', error);
        throw new Error('Could not establish connection. Receiving end does not exist.');
      }));
  }
  
   }

  
  



