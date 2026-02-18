
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../services/supabase';
import { Session, User, SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js';

interface AuthContextData {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
    signIn: (credentials: SignInWithPasswordCredentials) => Promise<{ error: any }>;
    signUp: (credentials: SignUpWithPasswordCredentials) => Promise<{ error: any }>;
    signInAnonymously: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (credentials: SignInWithPasswordCredentials) => {
        return await supabase.auth.signInWithPassword(credentials);
    };

    const signUp = async (credentials: SignUpWithPasswordCredentials) => {
        return await supabase.auth.signUp(credentials);
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const signInAnonymously = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInAnonymously();
        if (error) {
            console.error('Error signing in anonymously:', error);
            alert(`Erro ao entrar: ${error.message}\n\nPara resolver:\n1. Vá ao Dashboard do Supabase -> Auth -> Providers\n2. Ative 'Anonymous Sign-ins'`);
        }
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut, signIn, signUp, signInAnonymously }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
