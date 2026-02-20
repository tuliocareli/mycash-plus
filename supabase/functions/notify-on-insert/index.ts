
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from 'npm:resend'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

serve(async (req) => {
    console.log("--- NOVA REQUISIÇÃO RECEBIDA ---")

    try {
        const payload = await req.json()
        console.log("Tabela:", payload.table)
        console.log("Operação:", payload.type)

        const subject = `[MyCash+] Nova inserção na tabela ${payload.table}`

        console.log("Tentando enviar e-mail para:", Deno.env.get('NOTIFY_EMAIL'))

        const { data, error } = await resend.emails.send({
            from: 'MyCash+ Monitor <onboarding@resend.dev>',
            to: Deno.env.get('NOTIFY_EMAIL'),
            subject: subject,
            html: `<h2>Novo registro em ${payload.table}</h2><pre>${JSON.stringify(payload.record, null, 2)}</pre>`
        })

        if (error) {
            console.error("ERRO NO RESEND:", error)
            return new Response(JSON.stringify(error), { status: 500 })
        }

        console.log("E-MAIL ENVIADO COM SUCESSO! ID:", data?.id)
        return new Response(JSON.stringify({ message: "OK", id: data?.id }), { status: 200 })

    } catch (err) {
        console.error("ERRO GERAL NA FUNÇÃO:", err.message)
        return new Response(JSON.stringify({ error: err.message }), { status: 500 })
    }
})
