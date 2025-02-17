import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCadastraBebidaComponent } from './form-cadastra-bebida.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProdutosService } from '../../services/produtos.service';
import { inject } from '@angular/core';

class ProdutosServiceMock {
  cadastrarProduto = jasmine.createSpy('cadastrarProduto').and.returnValue({});
  alterarProduto = jasmine.createSpy('altrerarProduto').and.returnValue({});
  pegarProduto = jasmine.createSpy('pegarProduto').and.returnValue({
    id: "1",
    nome: "cerveja",
    tipo: "alcoólica",
    preco_unidade: 5,
    consumo_medio_adulto_ml: 500,
    consumo_medio_crianca_ml: 0
  });
}


describe('FormCadastraBebidaComponent', () => {
  let component: FormCadastraBebidaComponent;
  let fixture: ComponentFixture<FormCadastraBebidaComponent>;
  let brodutosService: ProdutosServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormCadastraBebidaComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
      ],
      providers: [
        FormBuilder,
        { provide: ProdutosService, useClass: ProdutosServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormCadastraBebidaComponent);
    component = fixture.componentInstance;
    brodutosService = TestBed.inject(ProdutosService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário corretamente', () => {
    expect(component.bebidaForm).toBeDefined(); // Verifico se o formulário foi inicializado
    expect(component.bebidaForm.controls['nome']).toBeDefined();
    expect(component.bebidaForm.controls['tipo']).toBeDefined();
    expect(component.bebidaForm.controls['preco_unidade']).toBeDefined();
    expect(component.bebidaForm.controls['consumo_medio_adulto_ml']).toBeDefined();
    expect(component.bebidaForm.controls['consumo_medio_crianca_ml']).toBeDefined();
  });
});
