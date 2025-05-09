import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './login/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(private router:Router, private auth:AuthService){}
  
  canActivate(): boolean {
    
    if (!this.auth.canActivate()) {
  
      this.router.navigate(['login']);
  
      return false;
    }
    return true;
  }
  
  
}
