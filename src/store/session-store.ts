import { create } from "zustand"; import { persist } from "zustand/middleware"; import type { UserProfile } from "@/features/auth/types";
interface SessionState { user?: UserProfile; setUser:(user:UserProfile)=>void; clearUser:()=>void; }
export const useSessionStore = create<SessionState>()(persist((set)=>({ user:undefined, setUser:(user)=>set({user}), clearUser:()=>set({user:undefined}) }),{name:"nexware.session"}));
