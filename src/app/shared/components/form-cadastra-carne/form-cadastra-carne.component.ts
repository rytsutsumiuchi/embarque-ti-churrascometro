import { Component, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Carne } from '../../models/carne.interface';
import { ProdutosService } from '../../services/produtos.service';
import { tap } from 'rxjs';
import { PrecoMinimoDirective } from '../../validators/preco-minimo.directive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-cadastra-carne',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    CommonModule,
    PrecoMinimoDirective
  ],
  templateUrl: './form-cadastra-carne.component.html',
  styleUrl: './form-cadastra-carne.component.scss',
})
export class FormCadastraCarneComponent {
  @Input() id!: string;
  @Input()  endpoint!: string;
  carne: any = {};

  tipos: string[] = ['bovina', 'suína', 'ave'];

  constructor(
    private produtosService: ProdutosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.id) {
      this.carregaCarne(this.id);
    }
  }

  onSubmit(form: NgForm) {
    console.log('Valores obtidos do formulário', form.value);

    if (form.valid) { // Verificando se o formulário é valido
      let carneNova: Carne = form.value; // Criando uma instância de Carne a partir dos valores do formulário
      if (this.id) { // Verificando se estamos editando uma carne
        carneNova.id = this.id;
        this.editarCarne(carneNova.id, carneNova); // Enviando a carne editada para o backend
      } else {
        this.cadastrarCarne(carneNova); // Enviando a nova carne para o backend
      }
    }
  }

  cadastrarCarne(carne: Carne) {
    this.produtosService
      .cadastrarProduto(this.endpoint, carne)
      .pipe(
        tap((carneCriada: any) => {
          console.log('Carne criada', carneCriada);
          this.router.navigate(['produtos']);
        })
      )
      .subscribe();
  }

  editarCarne(id: string, carne: Carne): void {
    this.produtosService.alterarProduto(this.endpoint, id, carne).pipe(
      tap(() => {
        this.router.navigate(['produtos']);
      })
    ).subscribe();
  }

  carregaCarne(id: string) {
    this.produtosService.pegarProduto(this.endpoint, id).pipe(
      tap((carne: Carne) => {
        this.carne = carne; // Carregando a carne para o formulário
      })
    ).subscribe();
  }
}
