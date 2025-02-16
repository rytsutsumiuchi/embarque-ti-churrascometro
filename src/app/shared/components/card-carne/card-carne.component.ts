import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-card-carne',
  standalone: true,
  imports: [ CommonModule, MatCardModule ],
  templateUrl: './card-carne.component.html',
  styleUrl: './card-carne.component.scss'
})
export class CardCarneComponent {
  @Input() carne!: any

  // {
  //   "id": "1",
  //   "nome": "picanha",
  //   "tipo": "bovina",
  //   "preco_kg": 70,
  //   "consumo_medio_adulto_g": 300,
  //   "consumo_medio_crianca_g": 100
  // }
}
