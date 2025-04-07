import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // ou onde estiver seu service
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  perfilForm: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  constructor() {
    this.perfilForm = this.fb.group({
      nome: [''],
      email: [{ value: '', disabled: true }],
      telefone: [''],
    });
  }

  ngOnInit(): void {
    this.carregarDadosUsuario();
  }

  carregarDadosUsuario(): void {
    this.authService.getPerfil().subscribe({
      next: (usuario) => {
        this.perfilForm.patchValue(usuario);
      },
      error: (err) => {
        console.error('Erro ao carregar dados do usuário:', err);
      }
    });
  }

  salvarAlteracoes(): void {
    if (this.perfilForm.valid) {
      const dados = this.perfilForm.getRawValue();
      this.authService.atualizarPerfil(dados).subscribe({
        next: () => {
          alert('Perfil atualizado com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao atualizar perfil:', err);
          alert('Erro ao atualizar perfil!');
        }
      });
    }
  }
}
