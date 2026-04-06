
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from 'npm:resend'
import { createClient } from 'npm:@supabase/supabase-js@2'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

serve(async (req) => {
    console.log("--- NOVA REQUISIÇÃO RECEBIDA ---")

    try {
        const payload = await req.json()
        console.log("Tabela:", payload.table)
        console.log("Operação:", payload.type)

        // Pegar o ID do usuário que gerou a alteração
        const userId = payload.record.user_id || payload.record.id;
        
        if (!userId) {
            console.log("Nenhum user_id encontrado no payload. Ignorando.");
            return new Response(JSON.stringify({ message: "Ignored: No user_id" }), { status: 200 })
        }

        // Consultar o e-mail do usuário no banco
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
        const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: user } = await supabase.from('users').select('email').eq('id', userId).single();

        if (user?.email !== 'teste@email.com') {
            console.log(`Email ignorado. O e-mail do usuário é: ${user?.email || 'desconhecido'}`);
            return new Response(JSON.stringify({ message: "Ignored user" }), { status: 200 })
        }

        console.log("Usuário teste@email.com detectado. Preparando envio...")
        const subject = `[Purso] Nova inserção na tabela ${payload.table}`

        console.log("Tentando enviar e-mail para:", Deno.env.get('NOTIFY_EMAIL'))

        const { data, error } = await resend.emails.send({
            from: 'Purso Monitor <onboarding@resend.dev>',
            to: Deno.env.get('NOTIFY_EMAIL') as string,
            subject: subject,
            html: `<h2>Novo registro em ${payload.table}</h2><pre>${JSON.stringify(payload.record, null, 2)}</pre>`
        })

        if (error) {
            console.error("ERRO NO RESEND:", error)
            return new Response(JSON.stringify(error), { status: 500 })
        }

        console.log("E-MAIL ENVIADO COM SUCESSO! ID:", data?.id)
        return new Response(JSON.stringify({ message: "OK", id: data?.id }), { status: 200 })

    } catch (err: any) {
        console.error("ERRO GERAL NA FUNÇÃO:", err.message)
        return new Response(JSON.stringify({ error: err.message }), { status: 500 })
    }
})
