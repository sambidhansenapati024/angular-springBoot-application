import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { User } from '../user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  user:User=new User();
  ValidationUser: string = '';
  ValidationPassword: string = '';
  showWelcomeScreen: boolean = true;
  loading: boolean = false;
  showPassword: boolean = false;
  isTransitioning: boolean = false;

  constructor( private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private toster: ToastrService
    ) { }

  ngOnInit(): void {
    localStorage.removeItem("accesstoken");
  }

  @HostListener('window:scroll', [])
  onScroll() {
    if (this.showWelcomeScreen && !this.isTransitioning) {
      this.startTransition();
    }
  }

  startTransition() {
    this.isTransitioning = true;
    setTimeout(() => {
      this.showWelcomeScreen = false;
      this.isTransitioning = false;
    }, 500);
  }

  onSubmit() {
    this.loading = true;

    this.productService.login(this.user).subscribe(
      (data) => {
        console.log(data)
        setTimeout(() => {
          this.loading = false;

          if (data.access_token === "No token") {
            this.ValidationPassword = data.message;
          } else if (data.code === "Failed") {
            this.ValidationUser = data.message;
          } else if (data.code === "NULLCOD") {
            alert('fill the entries')
            this.toster.error('Fill the entries', 'Log in Failed', {
              timeOut: 3000,
            });
          } else {
            localStorage.setItem("accesstoken", data.details[0].access_token);
            this.router.navigate(['list-product']);
            this.toster.success("LogIn Successful");
          }
        }, 700);
      },
      (error) => {
        setTimeout(() => {
          this.loading = false;
          this.toster.error('Login failed. Please try again.', 'Error', {
            timeOut: 3000,
          });
        }, 3000);
      }
    );
  }

  removeVal() {
    this.ValidationUser = '';
    this.ValidationPassword = '';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
