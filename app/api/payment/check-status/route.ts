import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const transactionId = searchParams.get('transactionId')

    if (!transactionId) {
        return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 })
    }

    try {
        const supabase = await createClient()

        // Verificar status na tabela user_assets
        // Nota: O webhook da AbacatePay deve atualizar esta tabela
        // Se não tiver webhook configurado, isso nunca vai mudar para 'completed' automaticamente
        // Mas vamos deixar pronto.
        const { data, error } = await supabase
            .from('user_assets')
            .select('payment_status')
            .eq('transaction_id', transactionId)
            .single()

        if (error) {
            throw error
        }

        return NextResponse.json({
            status: data?.payment_status || 'pending',
            completed: data?.payment_status === 'completed'
        })
    } catch (error) {
        return NextResponse.json({ error: 'Error checking status' }, { status: 500 })
    }
}
