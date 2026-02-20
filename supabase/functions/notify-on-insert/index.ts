
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from 'npm:resend'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

serve(async (req) => {
    try {
        const payload = await req.json()
        const { record, table, type, schema } = payload

        // Logins autorizados para monitoramento
        const monitoredEmails = ['admin@teste.com', 'user@teste.com']

        // Tenta identificar o email do usuário que realizou a ação
        // Note: O payload do webhook do Supabase geralmente contém o 'record' (novo dado)
        // Se a tabela tiver um campo 'user_id' ou similar, podemos usá-lo.
        // Para simplificar e garantir que você receba a notificação, 
        // vamos logar os detalhes do dado inserido.

        const subject = `[MyCash+] Nova inserção na tabela ${table}`

        const html = `
      <h2>Notificação de Atividade</h2>
      <p>Um novo registro foi inserido no banco de dados.</p>
      <hr />
      <ul>
        <li><strong>Tabela:</strong> ${table}</li>
        <li><strong>Operação:</strong> ${type}</li>
        <li><strong>Schema:</strong> ${schema}</li>
        <li><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</li>
      </ul>
      <hr />
      <h3>Dados do Registro:</h3>
      <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px;">
${JSON.stringify(record, null, 2)}
      </pre>
      <p style="font-size: 12px; color: #666;">Enviado automaticamente pelo MyCash+ Monitor.</p>
    `

        const { data, error } = await resend.emails.send({
            from: 'MyCash+ Monitor <onboarding@resend.dev>',
            to: Deno.env.get('NOTIFY_EMAIL') || 'seu-email@exemplo.com',
            subject: subject,
            html: html,
        })

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            })
        }

        return new Response(JSON.stringify({ message: "Email enviado com sucesso", id: data?.id }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        })

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })
    }
})
