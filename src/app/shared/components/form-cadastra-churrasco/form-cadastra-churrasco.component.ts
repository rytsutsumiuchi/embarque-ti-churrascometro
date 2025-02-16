import { Component, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CarnesService } from '../../services/carnes.service';
import { BebidasService } from '../../services/bebidas.service';
import { Bebida } from '../../models/bebida.interface';
import { tap } from 'rxjs';
import { Carne } from '../../models/carne.interface';
import { Churrasco } from '../../models/churrasco.interface';
import { ChurrascoService } from '../../services/churrasco.service';


@Component({
  selector: 'app-form-cadastra-churrasco',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './form-cadastra-churrasco.component.html',
  styleUrl: './form-cadastra-churrasco.component.scss',
})
export class FormCadastraChurrascoComponent {
  // Formulario

  // 1 - Nome e Pessoas
  // 2 - Carne
  // 3 - Bebida

  pessoasForm!: FormGroup;
  carnesForm!: FormGroup;
  bebidasForm!: FormGroup;

  carnesLista: Carne[] = [];
  bebidasLista: Bebida[] = [];

  carnesSelecionadas!: string[];
  bebidasSelecionadas!: string[];

  adultos_total: number = 0;
  criancas_total: number = 0;

  valor_total: number = 0;

  churrasco: Churrasco = {
    nome: '',
    quantidade_adultos: 0,
    quantidade_criancas: 0,
    carnes: [],
    bebidas: []
  };

  exibirResultados = false;

  constructor(
    private formBuilder: FormBuilder,
    private carnesService: CarnesService,
    private bebidasService: BebidasService,
    private churrascoService: ChurrascoService
  ) {
    // Construir meus formulários, ou seja agrupar os controles em um grupo
    this.pessoasForm = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3)]],
      quantidade_adultos: [null, [Validators.required, Validators.min(1)]],
      quantidade_criancas: [null],
    });

    // Iniciar os formulários
    this.carnesForm = this.formBuilder.group({});
    this.bebidasForm = this.formBuilder.group({});

    // Carregar carnes e bebidas e adicionando campos em seus respectivos formulários
    this.carregaCarnesNoFormulario();
    this.carregaBebidasNoFormulario();
  }

  private carregaCarnesNoFormulario(): void {
    this.carnesService.listarCarnes().pipe(
      tap((carnes: Carne[]) => {
        this.carnesLista = carnes; // Armazenei lista na variável
        this.carnesLista.forEach((carne: Carne) => {
          // Criando campos novos com os nomes das carnes registradas
          this.addCampoFormulario(this.carnesForm, carne.nome);
        })
      })).subscribe();
  }

  private carregaBebidasNoFormulario(): void {
    this.bebidasService.listarBebidas().pipe(
      tap((bebidas: Bebida[]) => {
        this.bebidasLista = bebidas; // Armazenei lista na variável
        this.bebidasLista.forEach((bebida: Bebida) => {
          // Criando campos novos com os nomes das bebidas registradas
          this.addCampoFormulario(this.bebidasForm, bebida.nome);
        })
      })).subscribe();
  }

  // Método genérico para adicionar campo a um formulário
  private addCampoFormulario(form: FormGroup, nome: string): void {
    form.addControl(nome, new FormControl(null));
  }

  calcularECadastrarChurrasco(): void {
    if (this.pessoasForm.valid 
      && this.carnesForm.valid 
      && this.bebidasForm.valid) 
      {
        const formPessoasValues = this.pessoasForm.value;
        this.carnesSelecionadas = [];
        this.bebidasSelecionadas = [];

        this.adultos_total = formPessoasValues.quantidade_adultos;
        this.criancas_total = formPessoasValues.quantidade_criancas;

        this.churrasco.nome = formPessoasValues.nome;

        const formCarnesValuesObject = this.carnesForm.value;

        // Iterando sobre meu objeto do formulário sobre seus campos
        // key: nome
        // value: valor inserido pelo usuário
        Object.entries(formCarnesValuesObject).forEach(([nomeCarne, valorCheckbox]) => {
          if (valorCheckbox) {
            this.carnesSelecionadas.push(nomeCarne);
          }
        })

        const formBebidasValuesObject = this.bebidasForm.value;

        // Iterando sobre meu objeto do formulário sobre seus campos
        Object.entries(formBebidasValuesObject).forEach(([nomeBebida, valorCheckbox]) => {
          if (valorCheckbox) {
            this.bebidasSelecionadas.push(nomeBebida);
          }
        })

        this.valor_total = this.calculaValorTotal();

        console.log(this.churrasco);
        this.cadastrarChurras(this.churrasco); // cadastro do churrasco
      }
  }

  calculaValorTotal(): number {
    let valor_total = 0;

    // Iterar sobre o array de todos os produtos, verificar se o 
    // item está presente em selecionados, caso esteja, o 
    // calculo deste item entra no total
    this.carnesLista.forEach((carne: Carne) => {
      if (this.carnesSelecionadas.includes(carne.nome)) {
        valor_total += this.calculaValorPorProduto(
          this.adultos_total,
          this.criancas_total,
          carne.consumo_medio_adulto_g,
          carne.consumo_medio_crianca_g,
          carne.preco_kg
        );
      }
    });

    this.bebidasLista.forEach((bebida: Bebida) => {
      if (this.bebidasSelecionadas.includes(bebida.nome)) {
        valor_total += this.calculaValorPorProduto(
          this.adultos_total,
          this.criancas_total,
          bebida.consumo_medio_adulto_ml,
          bebida.consumo_medio_crianca_ml,
          bebida.preco_unidade
        );
      }
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

  cadastrarChurras(churrasco: Churrasco): void {
    churrasco.quantidade_adultos = this.adultos_total;
    churrasco.quantidade_criancas = this.criancas_total;

    this.bebidasLista.forEach((bebida: Bebida) => {
      if (this.bebidasSelecionadas.includes(bebida.nome)) {
        churrasco.bebidas.push(bebida);
      }
    });

    this.carnesLista.forEach((carne: Carne) => {
      if (this.carnesSelecionadas.includes(carne.nome)) {
        churrasco.carnes.push(carne);
      }
    });

    console.log(this.churrasco);

    this.churrascoService.cadastrarChurrasco(churrasco).pipe(
      tap(() => {
        this.exibirResultados = true;
      })
    ).subscribe();
  }
}
