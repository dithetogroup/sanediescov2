import { Injectable } from '@angular/core';
import { UserDataLogin } from '../../../esco/escoInterfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  private userData = new BehaviorSubject<UserDataLogin | null>(this.getUserFromStorage());
  userData$ = this.userData.asObservable();

  private indemnityFilled = new BehaviorSubject<boolean>(false);
  indemnityFilled$ = this.indemnityFilled.asObservable();

  constructor() {
    this.checkTokenExpiration(); // ✅ Check expiration on service initialization
  }


  getUserSnapshot() {
    const user = this.userData.getValue(); // BehaviorSubject current value
    if (!user) {
      return {
        userDetails: null,
        esco_id: '',
        firstName: '',
        lastName: '',
        initials: '',
        userRole: '',
        roles: {
          isESCoUser: false,
          isAdminValidator: false,
          isSuperAdmin: false,
          isValidator: false
        }
      };
    }
  
    const { escoid, firstName, lastName, role } = user;
    const initials = firstName && lastName ? (firstName[0] + lastName[0]).toUpperCase() : '';
    const roles = this.getUserRoles();
  
    return {
      userDetails: user,
      esco_id: escoid,
      firstName,
      lastName,
      initials,
      userRole: role,
      roles
    };
  }
  

  /**
   * ✅ Set user data and store it in sessionStorage
   */
  setUserData(userData: UserDataLogin): void {
    const token = this.getToken(); // Get token from cookies
    if (token) {
      const decodedToken: any = this.decodeJWT(token);
      userData.exp = decodedToken?.exp || null; // ✅ Store expiration timestamp
    }
    this.userData.next(userData);
    sessionStorage.setItem('currentUser', JSON.stringify(userData)); // ✅ Persist session
  }

  /**
   * ✅ Retrieve user data but logout if token expired
   */
  getUserData(): UserDataLogin | null {
    const userData = this.userData.getValue();

    if (userData) {
      const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
      if (userData.exp && userData.exp < currentTime) {
        this.logout(); // ✅ Expired session, force logout
        return null;
      }
    }
    return userData;
  }

  /**
   * ✅ Check token expiration on app start
   */
  private checkTokenExpiration(): void {
    const userData = this.getUserFromStorage();
    if (userData) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (userData.exp && userData.exp < currentTime) {
        this.logout(); // ✅ Auto logout if expired
      }
    }
  }

  /**
   * ✅ Get user data from sessionStorage
   */
  private getUserFromStorage(): UserDataLogin | null {
    const storedUser = sessionStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  /**
   * ✅ Decode JWT Token
   */
  private decodeJWT(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    } catch (e) {
      return null;
    }
  }

  /**
   * ✅ Retrieve token from cookies
   */
  private getToken(): string | null {
    const matches = document.cookie.match(/(^| )auth_token=([^;]+)/);
    return matches ? matches[2] : null;
  }

  getUserRoles() {
    const user = this.userData.getValue();
    const role = user?.role || '';
  
    return {
      isESCoUser: role === 'escouser',
      isAdminValidator: role === 'adminvalidator',
      isSuperAdmin: role === 'Super Admin',
      isValidator: role === 'Validator',
    };
  }


  /**
   * ✅ Logout user and clear session storage
   */
  logout(): void {
    this.userData.next(null);
    this.indemnityFilled.next(false);
    sessionStorage.removeItem('currentUser'); // ✅ Clear stored session
    document.cookie = "auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;"; // ✅ Delete token
  }

  /**
   * ✅ Check if user is logged in
   */
  isLoggedIn(): boolean {
    return !!this.getUserFromStorage(); // ✅ Ensures persistence across refreshes
  }
}
