
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Terms() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-neutral-50 p-6 md:p-12 lg:p-20">
            <div className="max-w-3xl mx-auto space-y-12 animate-fade-in">
                
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-neutral-500 hover:text-neutral-1100 font-bold uppercase tracking-widest text-xs transition-colors"
                >
                    <ArrowLeft size={16} />
                    Voltar
                </button>

                <header className="space-y-4">
                    <h1 className="text-4xl font-black text-neutral-1100 tracking-tighter">Termos de Uso e Política de Privacidade</h1>
                    <p className="text-neutral-500 font-medium italic">Última atualização: 15 de Março de 2026</p>
                </header>

                <div className="prose prose-neutral max-w-none space-y-8 text-neutral-800">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-neutral-1100">1. Sobre o MyCash+</h2>
                        <p className="leading-relaxed">
                            O MyCash+ é uma aplicação de portfólio e estudo em ambiente Beta. O objetivo principal é demonstrar competências técnicas em desenvolvimento Full Stack, UX/UI e Segurança de Dados. Ao utilizar este sistema, você entende que ele não é um produto financeiro comercial finalizado.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-neutral-1100">2. Coleta de Dados</h2>
                        <p className="leading-relaxed">
                            Coletamos apenas o seu <strong>E-mail</strong> e <strong>Nome</strong> através do Google OAuth para criar sua conta. Informações financeiras (transações, contas, metas) são inseridas voluntariamente por você para teste da interface.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-neutral-1100">3. Segurança e RLS</h2>
                        <p className="leading-relaxed">
                            Seus dados são protegidos por Row Level Security (RLS) no Supabase. Isso significa que apenas a sua conta autenticada tem permissão técnica para ler ou escrever seus dados. Nem mesmo outros usuários logados podem acessar suas informações.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-neutral-1100">4. Exclusão de Dados</h2>
                        <p className="leading-relaxed">
                            Em conformidade com a LGPD, você tem total controle sobre seus dados. A qualquer momento, você pode utilizar a função <strong>"Limpar Todos os Dados"</strong> na sua página de Perfil para apagar permanentemente todos os registros vinculados à sua conta.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-neutral-1100">5. Uso de Cookies</h2>
                        <p className="leading-relaxed">
                            Utilizamos cookies apenas para manter sua sessão ativa com segurança através do Supabase Auth. Não utilizamos cookies de rastreamento de terceiros para fins publicitários.
                        </p>
                    </section>

                    <section className="space-y-4 border-t border-neutral-100 pt-8">
                        <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">
                            Ao continuar utilizando o MyCash+, você concorda com estes termos de transparência e uso ético de dados.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
