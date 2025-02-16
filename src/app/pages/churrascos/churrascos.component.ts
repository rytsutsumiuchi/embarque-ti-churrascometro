import { Component } from '@angular/core';
import { ListaChurrascoComponent } from '../../shared/components/lista-churrasco/lista-churrasco.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-churrascos',
  standalone: true,
  imports: [ ListaChurrascoComponent, MatButtonModule],
  templateUrl: './churrascos.component.html',
  styleUrl: './churrascos.component.scss'
})
export class ChurrascosComponent {

}
