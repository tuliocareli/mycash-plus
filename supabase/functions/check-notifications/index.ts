import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import { Resend } from "npm:resend"

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get users with active preferences
    const { data: prefs, error: prefsError } = await supabaseClient
      .from('notification_preferences')
      .select(`
        user_id,
        bills_due,
        credit_limit,
        goals_achieved,
        users!inner(email, name)
      `)

    if (prefsError) throw prefsError

    const today = new Date()
    const targetDueDay = new Date(today)
    targetDueDay.setDate(today.getDate() + 3) // Vence em 3 dias
    const dayToSearch = targetDueDay.getDate()

    let processedCount = 0;

    for (const pref of prefs || []) {
      const email = pref.users.email
      // In Resend Free Tier, testing is usually restricted to the registered email. But we still try to send.
      const notifyEmail = Deno.env.get('NOTIFY_EMAIL') || email 
      
      let htmlBody = ''

      // 1. Vencimento de Cartão / Conta
      if (pref.bills_due) {
        // Here we just check cartões with specific due_day for simplicity
        const { data: cards } = await supabaseClient
          .from('accounts')
          .select('name, due_day, current_bill')
          .eq('user_id', pref.user_id)
          .eq('type', 'CREDIT_CARD')
          .eq('due_day', dayToSearch)
        
        if (cards && cards.length > 0) {
          htmlBody += `<h3 style="color:#222;">Contas a vencer em 3 dias:</h3><ul style="color:#555;">`
          cards.forEach(c => {
            htmlBody += `<li><b>${c.name}</b>: R$ ${c.current_bill} (Vence dia ${c.due_day})</li>`
          })
          htmlBody += `</ul>`
        }
      }

      // 2. Alerta de limite
      if (pref.credit_limit) {
        const { data: cards } = await supabaseClient
            .from('accounts')
            .select('name, current_bill, credit_limit')
            .eq('user_id', pref.user_id)
            .eq('type', 'CREDIT_CARD')
        
        const almostMaxed = cards?.filter(c => c.credit_limit && (c.current_bill / c.credit_limit) >= 0.8)
        if (almostMaxed && almostMaxed.length > 0) {
            htmlBody += `<h3 style="color:#222;">Aviso de Limite (>80%):</h3><ul style="color:#555;">`
            almostMaxed.forEach(c => {
              htmlBody += `<li><b>${c.name}</b>: Usado R$ ${c.current_bill} de R$ ${c.credit_limit}</li>`
            })
            htmlBody += `</ul>`
        }
      }

      if (htmlBody) {
        await resend.emails.send({
          from: 'MyCash+ Alertas <onboarding@resend.dev>',
          to: notifyEmail,
          subject: '[MyCash+] Seus Alertas do Dia',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #111;">Olá ${pref.users.name || 'Usuário'},</h2>
              ${htmlBody}
              <hr style="margin-top:30px; border:none; border-top:1px solid #eee;" />
              <p style="font-size: 12px; color: #999;">Para gerenciar esses alertas, acesse a aba Meu Perfil no MyCash+.</p>
            </div>
          `
        })
        processedCount++;
      }
    }

    return new Response(JSON.stringify({ success: true, processedEmails: processedCount }), { headers: { "Content-Type": "application/json" } })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
})
