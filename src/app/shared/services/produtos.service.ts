import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Carne } from '../models/carne.interface';
import { Bebida } from '../models/bebida.interface';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  private API_URL = 'http://localhost:3000';


  constructor(private http: HttpClient) { } // Injeção de dependência do HttPClient

  public listarProdutos(endpoint: string): Observable<Carne[] | Bebida[]> {
    return this.http.get<Carne[] | Bebida[]>(`${this.API_URL}/${endpoint}`)
    .pipe(catchError(this.pegaErro));
  }

  public pegarProduto(endpoint: string, id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${endpoint}/${id}`)
    .pipe(catchError(this.pegaErro));
  }

  public cadastrarProduto(endpoint: string, produto: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/${endpoint}`, produto)
    .pipe(catchError(this.pegaErro));
  }

  public alterarProduto(endpoint: string, id: string, produto: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${endpoint}/${id}`, produto)
    .pipe(catchError(this.pegaErro));
  }

  public alterarNomeProduto(endpoint: string, id: string, produto: any): Observable<any> {
    return this.http.patch<any>(`${this.API_URL}/${endpoint}/${id}`, produto)
    .pipe(catchError(this.pegaErro));
  }

  public excluirProduto(endpoint: string, id: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${endpoint}/${id}`)
    .pipe(catchError(this.pegaErro));
  }

  private pegaErro(error: HttpErrorResponse): Observable<any> {
    console.log("Ocorreu um erro: ", error);
    return throwError(() => error);
  }
}
