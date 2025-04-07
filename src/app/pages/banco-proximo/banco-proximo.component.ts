import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BancoService } from '../../services/banco.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-banco-proximo',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './banco-proximo.component.html',
  styleUrls: ['./banco-proximo.component.css'],
  providers: [BancoService] // 🔥 importante para garantir a injeção
})
export class BancoProximoComponent implements OnInit {
  banco: any = null;
  erro: string | null = null;

  constructor(private bancoService: BancoService) {}

  ngOnInit(): void {
    this.pegarLocalizacao();
  }

  pegarLocalizacao() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Latitude:', latitude, 'Longitude:', longitude); // ✅ debug

          this.bancoService.buscarBancoMaisProximo(latitude, longitude).subscribe({
            next: (data) => {
              console.log('Banco mais próximo:', data); // ✅ debug
              if (data) {
                this.banco = data;
              } else {
                this.erro = 'Nenhum banco de leite encontrado.';
              }
            },
            error: (err) => {
              console.error('Erro da API:', err); // ✅ debug
              this.erro = err.error?.error || 'Erro ao buscar banco mais próximo';
            }
          });
        },
        (error) => {
          console.error('Erro ao obter localização:', error); // ✅ debug
          this.erro = 'Erro ao obter a localização.';
        }
      );
    } else {
      this.erro = 'Geolocalização não suportada pelo navegador.';
    }
  }
}
