import type { RoleName } from "@/types/domain";
export interface UserProfile{ id:string; email:string; firstName:string; lastName:string; phoneNumber?:string; roles:RoleName[]; lastLoginAt?:string; }
export interface AuthResponse{ accessToken:string; refreshToken:string; tokenType:string; expiresIn:number; user:UserProfile; }
export interface LoginRequest{ email:string; password:string; }
export interface RegisterRequest{ email:string; password:string; firstName:string; lastName:string; phoneNumber?:string; roles?:RoleName[]; }
