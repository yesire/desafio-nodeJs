import { Observable } from 'rxjs/internal/Observable';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';

import { MyErrorStateMatcher } from '../shared/my-error-state-matcher.component';
import { UserRegistryService } from './user-registry.service';

@Component({
  selector: 'app-user-registry',
  templateUrl: './user-registry.component.html',
  styleUrls: ['./user-registry.component.css'],
})
export class UserRegistryComponent implements OnInit {
  form!: FormGroup;
  isLoading: boolean = false;
  user!: User;
  users: User[] = [];
  isRegistered: boolean = false;

  matcher = new MyErrorStateMatcher();

  constructor(
    public userRegistryService: UserRegistryService,
    public route: ActivatedRoute,
    public router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.createForm(new User());
    this.getUsers();
  }

  createForm(user: User) {
    this.form = new FormGroup({
      cpf: new FormControl(user.cpf, {
        validators: [Validators.required, Validators.minLength(11)],
      }),
      name: new FormControl(user.name, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      email: new FormControl(user.email, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(user.password, {
        validators: [Validators.required, Validators.minLength(6)],
      }),
      phone: new FormControl(user.phone, {
        validators: [Validators.required, Validators.minLength(11)],
      }),
    });

    this.user = user;
  }

  add(user: User) {
    this.userRegistryService.addUser(user).subscribe((user) => {
      this.users.push(user);
    });
  }
  getUsers() {
    this.userRegistryService.getUsers().subscribe((users) => {
      users.forEach((user) => {
        this.users.push(user);
      });
    });
  }

  getUserByCpf(cpf: string) {
    const user = this.userRegistryService
      .getUserByCpf(cpf)
      .subscribe((user) => {
        this.user = user;
      });
    return user;
  }

  /*  onCheckPassword(password: string) {
    if (password === this.form.get('password')?.value) {
      return true;
    } else {
      return false;
    }
  } */

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  getErrorMessage(field: string) {
    switch (field) {
      case 'cpf':
        if (this.form.get('cpf')!.hasError('required')) {
          return 'Você deve informar um CPF';
        }
        return this.form.get('cpf')!.hasError('text') ? 'CPF inválido' : '';
        break;
      case 'email':
        if (this.form.get('email')!.hasError('required')) {
          return 'Você deve informar um email';
        }
        return this.form.get('email')!.hasError('email')
          ? 'Email inválido'
          : '';
        break;
      case 'password':
        if (this.form.get('password')!.hasError('required')) {
          return 'Você deve informar uma senha';
        }
        return this.form.get('password')!.hasError('text')
          ? 'Senha inválida'
          : '';
        break;
      case 'name':
        if (this.form.get('name')!.hasError('required')) {
          return 'Você deve informar um nome com mais de 3 letras';
        }
        return this.form.get('name')!.hasError('text') ? 'Nome inválido' : '';
        break;
      default:
        return 'Informação inválida. Verifique os campos do formulário.';
        break;
    }
  }
  onSubmit() {
    if (this.form.valid) {
      this.user = this.form.value;
      console.log(this.user);
      this.add(this.user);
      this.form.reset();
      this.router.navigate(['login']);
    }

    /* if (!this.form.invalid) {
      if (this.getUserByCpf(user.cpf) != null) {
        this.isRegistered = true;
        this._snackBar.open('Usuário já cadastrado', 'Sair', {
          duration: 2000,
        });
        this.form.reset();
      } else {
        this._snackBar.open(
          'Você deve informar os dados para cadastrar',
          'Sair',
          { duration: 2000 }
        );
      }
    } else {
      this.add(user);
      this.form.reset();
    } */
  }
}
