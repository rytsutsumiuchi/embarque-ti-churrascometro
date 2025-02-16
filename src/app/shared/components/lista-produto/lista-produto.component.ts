import { Component, Input } from '@angular/core';
import { CarnesService } from '../../services/carnes.service';
import { BebidasService } from '../../services/bebidas.service';
import { tap } from 'rxjs';
import { Carne } from '../../models/carne.interface';
import { Bebida } from '../../models/bebida.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-produto',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './lista-produto.component.html',
  styleUrl: './lista-produto.component.scss'
})
export class ListaProdutoComponent {
  produtos!: any;

  @Input() tipo!: string;

  constructor(
    private carnesService: CarnesService,
    private bebidasService: BebidasService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregaProdutos(this.tipo);    
  }

  carregaProdutos(tipo: string): void {
    if (tipo === 'carnes') {
      this.carregaCarnes();
    } else if (tipo === 'bebidas') {
      this.carregaBebidas();
    }
  }

  carregaCarnes(): void {
    this.carnesService.listarCarnes().pipe(
      tap((carnes: Carne[]) => {
        this.produtos = carnes;
      })
    ).subscribe();
  }

  carregaBebidas(): void {
    this.bebidasService.listarBebidas().pipe(
      tap((bebidas: Bebida[]) => {
        this.produtos = bebidas;
      })
    ).subscribe();
  }

  goToEditarProduto(tipo: string,id: string): void {
    this.router.navigate(['produtos', tipo, id]);
  }
}
