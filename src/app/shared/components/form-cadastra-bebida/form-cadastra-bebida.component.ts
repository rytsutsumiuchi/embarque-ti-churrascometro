import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { BebidasService } from '../../services/bebidas.service';
import { Bebida } from '../../models/bebida.interface';
import { tap } from 'rxjs';
import { precoMinimoValidator } from '../../validators/preco-minimo.validator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-cadastra-bebida',
  standalone: true,
  imports: [ 
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
   ],
  templateUrl: './form-cadastra-bebida.component.html',
  styleUrl: './form-cadastra-bebida.component.scss'
})
export class FormCadastraBebidaComponent {
  @Input() id!: string;

  bebidaForm!: FormGroup; // Formulário de cadastro de bebida do tipo FormGroup

  tipos: string[] = [
    'alcoólica',
    'não alcoólica'
  ];

  // Injeção de dependência do FormBuilder
  constructor(
    private builder: FormBuilder, 
    private bebidaService: BebidasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inicializando o formulário com o builder com os valores iniciais vazios
    this.bebidaForm = this.builder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      tipo: ['', Validators.required],
      preco_unidade: ['', [Validators.required, precoMinimoValidator(5)]],
      consumo_medio_adulto_ml: ['', Validators.required],
      consumo_medio_crianca_ml: ['', Validators.required],
    });

    if (this.id) { // Se estiver editando uma bebida
      this.carregaBebida(this.id); // Carrega a bebida para o formulário
    }
  }

  onSubmit(): void {
    console.log('Valores obtidos do formulário', this.bebidaForm.value);

    if (this.bebidaForm.valid) { // Se o formulário for valido
      let bebidaNova: Bebida = this.bebidaForm.value; // Criando uma instância de Bebida a partir dos valores do formulário

      if (this.id) { // Se estiver editando uma bebida
        bebidaNova.id = this.id; // Adicionando o id da bebida
        this.editarBebida(bebidaNova.id, bebidaNova); // Enviando a bebida editada para o backend
      } else {
        this.cadastrarBebida(bebidaNova); // Enviando a nova bebida para o backend
      }
    }
  }

  cadastrarBebida(bebida: Bebida): void {
    this.bebidaService.cadastrarBebida(bebida).pipe(
      tap((bebidaCriada: Bebida) => {
        console.log('Bebida criada com sucesso', bebidaCriada);
        this.bebidaForm.reset(); // Limpa o formulário
      })
    ).subscribe();
  }

  editarBebida(id: string, bebida: Bebida): void {
    this.bebidaService.alterarBebida(id, bebida).pipe(
      tap(() => {
        this.router.navigate(['produtos']);
      })
    ).subscribe();
  }

  carregaBebida(id: string) {
    this.bebidaService.pegarBebida(id).pipe(
      tap((bebida: Bebida) => {
        // this.bebidaForm.controls['nome'].setValue(bebida.nome);
        // delete bebida.id;
        // this.bebidaForm.setValue(bebida);
        this.bebidaForm.patchValue(bebida);
      })
    ).subscribe();
  }
}
