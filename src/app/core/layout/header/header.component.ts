import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuthenticated:boolean;

  LoggedInUser:User;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    
    ) { }

  ngOnInit(): void {
    this.authService.isAuthenticated.subscribe(
      isLoggedIn =>{
        this.isAuthenticated=isLoggedIn;

        if (this.isAuthenticated) {
          //get user info
          this.authService.currentLoggedInUser.subscribe(user=>{
            this.LoggedInUser=user;
          });
        }
      }
    )
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/'])
  }

}
