import { NextRequest, NextResponse } from 'next/server'
import { createPixQrCode } from '@/lib/abacatepay'
import { createClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
    try {
        const { assetId } = await req.json()

        if (!assetId) {
            return NextResponse.json(
                { error: 'assetId é obrigatório' },
                { status: 400 }
            )
        }

        // Get user from session
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Usuário não autenticado' },
                { status: 401 }
            )
        }

        // Parallel Data Fetching
        const [assetResult, existingPurchaseResult, profileResult] = await Promise.all([
            // Get asset details
            supabase
                .from('assets')
                .select('*')
                .eq('id', assetId)
                .single(),
            // Check if user already owns this asset
            supabase
                .from('user_assets')
                .select('*')
                .eq('user_id', user.id)
                .eq('asset_id', assetId)
                .eq('payment_status', 'completed')
                .single(),
            // Get user profile
            supabase
                .from('profiles')
                .select('full_name, phone, tax_id')
                .eq('id', user.id)
                .single()
        ])

        const { data: asset } = assetResult
        const { data: existingPurchase } = existingPurchaseResult
        const { data: profile } = profileResult

        if (!asset) {
            return NextResponse.json(
                { error: 'Asset não encontrado' },
                { status: 404 }
            )
        }

        if (existingPurchase) {
            return NextResponse.json(
                { error: 'Você já possui este asset' },
                { status: 400 }
            )
        }

        let customerId: string | undefined

        // Criar cliente no AbacatePay se tiver todos os dados necessários
        if (profile?.full_name && profile?.phone && profile?.tax_id && user.email) {
            try {
                const { createCustomer } = await import('@/lib/abacatepay')
                const customer = await createCustomer({
                    name: profile.full_name,
                    cellphone: profile.phone,
                    email: user.email,
                    taxId: profile.tax_id,
                })
                customerId = customer.id
                console.log('Cliente criado no AbacatePay:', customerId)
            } catch (error) {
                console.warn('Erro ao criar cliente, continuando sem customerId:', error)
                // Continua sem customerId - o PIX será criado com customer inline
            }
        }

        // Create PIX QR Code
        const pixData = await createPixQrCode({
            assetId: asset.id,
            assetTitle: asset.title,
            price: asset.price,
            userId: user.id,
            userEmail: user.email!,
            userName: profile?.full_name || user.email!.split('@')[0],
            userPhone: profile?.phone,
            userTaxId: profile?.tax_id,
            customerId, // Passa o ID do cliente se foi criado
        })

        // Save pending payment
        await supabase.from('user_assets').insert({
            user_id: user.id,
            asset_id: assetId,
            purchase_date: new Date().toISOString(),
            amount_paid: asset.price,
            payment_status: 'pending',
            transaction_id: pixData.id,
            payment_method: 'pix',
        })

        // LOG: Audit Success
        try {
            const { logSystemEvent } = await import('@/lib/logger')
            await logSystemEvent({
                level: 'audit',
                category: 'payment',
                action: 'pix.created',
                message: `PIX criado para Asset ${asset.title}`,
                userId: user.id,
                metadata: {
                    assetId: asset.id,
                    price: asset.price,
                    transactionId: pixData.id
                }
            })
        } catch (logErr) {
            console.error("Log error (non-fatal):", logErr)
        }

        return NextResponse.json({
            success: true,
            pix: {
                id: pixData.id,
                qrCode: pixData.brCode, // Código copia e cola
                qrCodeImage: pixData.brCodeBase64, // Imagem do QR Code
                amount: pixData.amount / 100, // Converter de centavos para reais
                expiresAt: pixData.expiresAt,
            },
            asset: {
                title: asset.title,
                price: asset.price,
            },
        })
    } catch (error: any) {
        console.error('Erro ao criar PIX:', error)

        // LOG: Error Tracking
        try {
            const { logSystemEvent } = await import('@/lib/logger')
            await logSystemEvent({
                level: 'error',
                category: 'payment',
                action: 'pix.failed',
                message: error.message || 'Erro desconhecido ao criar PIX',
                metadata: { error: JSON.stringify(error) }
            })
        } catch { }

        return NextResponse.json(
            { error: error.message || 'Erro ao criar PIX' },
            { status: 500 }
        )
    }
}
