import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { verifyWebhookSignature } from '@/lib/abacatepay'

// Webhook do AbacatePay - Recebe notificações de pagamento
export async function POST(req: NextRequest) {
    try {
        const body = await req.text()
        const signature = req.headers.get('x-signature') || ''

        // Verificar assinatura do webhook (IMPORTANTE PARA SEGURANÇA)
        const isValid = verifyWebhookSignature(body, signature)
        if (!isValid) {
            console.error('❌ Assinatura do webhook inválida')
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
        }

        const event = JSON.parse(body)
        const supabase = createClient()

        console.log('📨 Webhook recebido:', event.type)

        // Processar diferentes tipos de eventos do AbacatePay
        switch (event.type) {
            case 'billing.paid': {
                // Pagamento confirmado - liberar acesso ao asset
                const { metadata, amount } = event.data
                const userId = metadata?.user_id
                const assetId = metadata?.asset_id

                if (userId && assetId) {
                    // Verificar se já não existe
                    const { data: existing } = await supabase
                        .from('user_assets')
                        .select('id')
                        .eq('user_id', userId)
                        .eq('asset_id', assetId)
                        .single()

                    if (!existing) {
                        // Adicionar asset à biblioteca do usuário
                        await supabase.from('user_assets').insert({
                            user_id: userId,
                            asset_id: assetId,
                            purchase_date: new Date().toISOString(),
                            amount_paid: amount,
                            payment_status: 'completed',
                            transaction_id: event.data.id,
                            payment_method: event.data.method || 'unknown',
                        })

                        console.log(`✅ Pagamento confirmado: Usuário ${userId} comprou asset ${assetId}`)
                    }
                }
                break
            }

            case 'billing.disputed': {
                // Contestação de pagamento - marcar como disputado
                const { metadata } = event.data
                const userId = metadata?.user_id
                const assetId = metadata?.asset_id

                if (userId && assetId) {
                    await supabase
                        .from('user_assets')
                        .update({ payment_status: 'refunded' })
                        .eq('user_id', userId)
                        .eq('asset_id', assetId)

                    console.log(`⚠️ Pagamento contestado: Usuário ${userId}, Asset ${assetId}`)
                }
                break
            }

            case 'withdraw.done':
            case 'withdraw.failed': {
                // Eventos de saque - apenas log
                console.log(`ℹ️ Evento de saque: ${event.type}`)
                break
            }

            default:
                console.log('ℹ️ Evento não tratado:', event.type)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('❌ Erro no webhook:', error)
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
    }
}

// Allow POST requests only
export async function GET() {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
