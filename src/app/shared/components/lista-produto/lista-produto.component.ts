import { Component, Input } from '@angular/core';
import { ProdutosService } from '../../services/produtos.service';
import { tap } from 'rxjs';
import { Carne } from '../../models/carne.interface';
import { Bebida } from '../../models/bebida.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'
import { ExcluirDialogComponent } from '../excluir-dialog/excluir-dialog.component';

@Component({
  selector: 'app-lista-produto',
  standalone: true,
  imports: [ CommonModule, MatButtonModule ],
  templateUrl: './lista-produto.component.html',
  styleUrl: './lista-produto.component.scss'
})
export class ListaProdutoComponent {
  produtos!: any;

  @Input() tipo!: string;

  constructor(
    private produtosService: ProdutosService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.carregaProdutos(this.tipo);    
  }

  carregaProdutos(tipo: string): void {
    this.produtosService.listarProdutos(this.tipo).pipe(
      tap((produtos: Carne[] | Bebida[]) => {
        this.produtos = produtos;
      })
    ).subscribe();
  }

  goToEditarProduto(tipo: string,id: string): void {
    this.router.navigate(['produtos', tipo, id]);
  }

  openExcluirDialog(tipo: string,id: string): void {
    const dialogRef = this.dialog.open(ExcluirDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.excluirProduto(tipo, id);
        console.log('deletado');
      } else {
        console.log('cancelado');
      }
    });
  }

  excluirProduto(tipo: string,id: string): void {
      this.produtosService.excluirProduto(tipo, id).pipe(
        tap((produto: Carne | Bebida) => {
          console.log("Produto excluído - ", produto)
          this.carregaProdutos(tipo);
        })
      ).subscribe();
  }
}
