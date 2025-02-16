import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormCadastraCarneComponent } from '../../shared/components/form-cadastra-carne/form-cadastra-carne.component';
import { FormCadastraBebidaComponent } from '../../shared/components/form-cadastra-bebida/form-cadastra-bebida.component';

@Component({
  selector: 'app-produtos-cadastro',
  standalone: true,
  imports: [ FormCadastraCarneComponent, FormCadastraBebidaComponent ],
  templateUrl: './produtos-cadastro.component.html',
  styleUrl: './produtos-cadastro.component.scss'
})
export class ProdutosCadastroComponent {
  parameterTipo!: string;
  parameterID!: string;

  @Input() set id(id: string) {
    console.log('ID', id);
    this.parameterID = id;
  }

  constructor(private router: ActivatedRoute) { }

  ngOnInit(): void {
    // console.log('TIPO 1', this.router.snapshot.params['tipo']);
    // console.log('TIPO 2', this.router.snapshot.paramMap.get('tipo'));
    // console.log('TIPO 3', this.router.snapshot.queryParamMap.get('tipo'));
    this.parameterTipo = this.router.snapshot.params['tipo'];
  }

}
