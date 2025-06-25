import { Component, OnInit } from '@angular/core';
import { MenuModulesService } from '../../services/menu-modules.service';
import { OrganizationService } from '../../services/organization.service';
import {CommonModule } from '@angular/common' ;
import {RouterModule } from '@angular/router' ;

declare var $ : any;
@Component({
    selector: 'app-side-nav',
    templateUrl: './side-nav.component.html',
    imports: [ CommonModule , RouterModule],
    styleUrls: ['./side-nav.component.css'],
    standalone: true
})
export class SideNavComponent implements OnInit {
  info: any;
  Role: any;
  org_id:any;
  bname:any = "None";
  menudataList:any;
  menuModuleList:any;
  mainMenu:any;
  FinalMenuList:any;
  
  constructor(private orgService:OrganizationService, private menuService:MenuModulesService) { }

  ngOnInit(): void {

  this.info = localStorage.getItem("info")
  this.info = JSON.parse(this.info)
  console.log("this.info", this.info);

    this.Role = window.localStorage.getItem('role');
    this.org_id = window.localStorage.getItem('org_id');
    console.log("Role", this.Role);
    console.log("Orgid", this.org_id);
    this.bname = this.info.bName;
    console.log("bname", this.bname);


   
  }

  ngAfterViewInit():any{
    //$("body").removeClass("fullscreen-enable");

    $("#side-menu").metisMenu();
    $("#vertical-menu-btn").on("click", function(e:any) { 
      e.preventDefault(),
       $("body").toggleClass("sidebar-enable"), 992 <= $(window).width() ? $("body").toggleClass("vertical-collpsed") : $("body").removeClass("vertical-collpsed") 
      })
      $(document).ready(function() {
        var e;
        0 < $("#sidebar-menu").length && 0 < $("#sidebar-menu .mm-active .active").length && (300 < (e = $("#sidebar-menu .mm-active .active").offset().top) && (e -= 300, $(".vertical-menu .simplebar-content-wrapper").animate({ scrollTop: e }, "slow")))
    })
      
    
    


    }
    
getMenuData(){
  console.log("menudataList", this.menuModuleList);
  console.log("mainMenu", this.mainMenu);
}



}
