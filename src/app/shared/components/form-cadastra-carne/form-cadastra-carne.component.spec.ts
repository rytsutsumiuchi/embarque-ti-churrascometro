import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormCadastraCarneComponent } from './form-cadastra-carne.component';
import { of } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PrecoMinimoDirective } from '../../validators/preco-minimo.directive';
import { ProdutosService } from '../../services/produtos.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';


// Mock para o Router
class RouterMock {
  navigate = jasmine.createSpy('navigate'); // Espia o método de navegação para testar quando ele é chamado
}

// Mock para o ProdutosService
class ProdutosServiceMock {
  cadastrarProduto = jasmine.createSpy('cadastrarProduto').and.returnValue(of({}));

  alterarProduto = jasmine.createSpy('alterarProduto').and.returnValue(of({}));

  pegarProduto = jasmine.createSpy('pegarProduto').and.returnValue(of({
    id: '123',
    nome: 'Picanha',
    tipo: 'bovina',
    preco_kg: 100,
    consumo_medio_adulto_g: 200,
    consumo_medio_crianca_g: 100
  }));
}

describe('FormCadastraCarneComponent', () => {
  let component: FormCadastraCarneComponent; // Instância do componente a ser testado
  let fixture: ComponentFixture<FormCadastraCarneComponent>; // manipulação do DOM
  let produtosService: ProdutosServiceMock; // Mock para o ProdutosService
  let router: RouterMock; // Mock para o Router

  beforeEach(async () => { // Antes de executar o teste
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormCadastraCarneComponent,
        BrowserAnimationsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        CommonModule,
        PrecoMinimoDirective
      ],
      providers: [
        { provide: ProdutosService, useClass: ProdutosServiceMock }, // Injeção de dependência do ProdutosService
        { provide: Router, useClass: RouterMock } // Injeção de dependência do Router
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCadastraCarneComponent);
    component = fixture.componentInstance;
    produtosService = TestBed.inject(ProdutosService) as any;
    router = TestBed.inject(Router) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Teste para verificar se o componente é criado corretamente
    expect(component).toBeTruthy();
  });

  it('deve carregar uma carne se o endpoint e o ID estiver presente', () => {
    component.endpoint = 'carnes';
    component.id = '123'; // Defini o id para pegar a carne

    component.ngOnInit(); // Chamei o método ngOnInit

    expect(produtosService.pegarProduto).toHaveBeenCalledWith(component.endpoint, component.id);

    expect(component.carne).toEqual({
      id: '123',
      nome: 'Picanha',
      tipo: 'bovina',
      preco_kg: 100,
      consumo_medio_adulto_g: 200,
      consumo_medio_crianca_g: 100
    });
  });

  it('deve chamar cadastraProduto quando o formulário é submetido', () => {
    const form: NgForm = {
      value: {
        nome: 'Maminha',
        tipo: 'bovina',
        preco_kg: 50,
        consumo_medio_adulto_g: 100,
        consumo_medio_crianca_g: 100
      },
      valid: true
    } as NgForm;

    // Chamei o método onSubmit do meu componente
    component.onSubmit(form);


    // É esperado o método cadastrarProduto do serviço ser chamado com o atributo endpoint e o value do meu formulário
    expect(produtosService.cadastrarProduto).toHaveBeenCalledWith(component.endpoint, form.value);
  })

  it('deve mudar a descrição do botão de submit caso tenha id presente', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const compiladoHtml = fixture.nativeElement;

    const botao = compiladoHtml?.querySelector('#submitButton');
    expect(botao).toBeTruthy();
    expect(botao?.textContent.trim()).toBe('Cadastrar nova carne');

    component.id = '123';

    fixture.detectChanges();
    await fixture.whenStable();

    expect(botao?.textContent.trim()).toBe('Editar carne');
  })
});
