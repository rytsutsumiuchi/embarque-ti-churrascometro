import { Component } from '@angular/core';
import { Churrasco } from '../../models/churrasco.interface';
import { ChurrascoService } from '../../services/churrasco.service';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Bebida } from '../../models/bebida.interface';
import { Carne } from '../../models/carne.interface';

@Component({
  selector: 'app-lista-churrasco',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './lista-churrasco.component.html',
  styleUrl: './lista-churrasco.component.scss'
})
export class ListaChurrascoComponent {

  churrascos!: Churrasco[];

  constructor(private churrascoService: ChurrascoService) { }

  ngOnInit(): void {
    this.carregaChurrascos();
  }

  carregaChurrascos(): void {
    this.churrascoService
      .listarChurrascos()
      .pipe(
        tap((churrascos: Churrasco[]) => {
          this.churrascos = churrascos;
        })
      ).subscribe();
  }

  calculaValorTotal(churrasco: Churrasco): number {
      let valor_total = 0;
  
      // Iterar sobre o array de todos os produtos, verificar se o 
      // item está presente em selecionados, caso esteja, o 
      // calculo deste item entra no total
      churrasco.carnes.forEach((carne: Carne) => {
          valor_total += this.calculaValorPorProduto(
            churrasco.quantidade_adultos,
            churrasco.quantidade_criancas,
            carne.consumo_medio_adulto_g,
            carne.consumo_medio_crianca_g,
            carne.preco_kg);
      });
  
      churrasco.bebidas.forEach((bebida: Bebida) => {
          valor_total += this.calculaValorPorProduto(
            churrasco.quantidade_adultos,
            churrasco.quantidade_criancas,
            bebida.consumo_medio_adulto_ml,
            bebida.consumo_medio_crianca_ml,
            bebida.preco_unidade
          );
      });
  
      return valor_total;
    }
  
    calculaValorPorProduto(
      quantAdultos: number,
      quantCriancas: number,
      consumoAdulto: number,
      consumoCrianca: number,
      precoProduto: number
    ): number {
      const consumo = quantAdultos * consumoAdulto + quantCriancas * consumoCrianca;
      return (consumo / 1000) * precoProduto;
    }

}
