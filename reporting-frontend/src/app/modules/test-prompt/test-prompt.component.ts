import { Component, OnInit } from '@angular/core';
import { TestPromptService } from './test-prompt.service';

@Component({
  selector: 'app-test-prompt',
  templateUrl: './test-prompt.component.html',
  styleUrl: './test-prompt.component.css'
})
export class TestPromptComponent implements OnInit{

  constructor(
    private testPromptService: TestPromptService
  ){}
  ngOnInit(): void {
    //this.testPromptService.testPrompt('DNSSI','POL-RISQUE','L\'\organisation a mis en place une politique de gestion des risques documentée, incluant des procédures et des processus pour identifier et évaluer les risques de sécurité des systèmes d\'\information. Cette politique est appliquée de manière régulière et systématique à travers les différents départements. Le niveau de maturité "Reproductible" indique que les pratiques de gestion des risques sont systématiquement appliquées et suivies à travers l\'\organisation, avec des processus bien définis et documentés. Les évaluations des risques sont effectuées de manière cohérente et les résultats sont documentés pour assurer une traçabilité.').subscribe(
      //(data) => console.log('recom: ',data)
    //)
  }


}
