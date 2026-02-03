// lib/abacatepay.ts
// AbacatePay Integration - PIX QRCode API

const ABACATEPAY_API_URL = 'https://api.abacatepay.com/v1'

export interface CreateCustomerParams {
    name: string
    cellphone: string
    email: string
    taxId: string
}

export interface CustomerResponse {
    id: string
    metadata: {
        name: string
        cellphone: string
        email: string
        taxId: string
    }
}

export interface CreatePixQrCodeParams {
    assetId: string
    assetTitle: string
    price: number
    userId: string
    userEmail: string
    userName: string
    userPhone?: string
    userTaxId?: string
    customerId?: string // ID do cliente criado previamente
}

export interface PixQrCodeResponse {
    id: string
    amount: number
    status: string
    brCode: string // Código PIX copia e cola
    brCodeBase64: string // QR Code em base64
    expiresAt: string
}

/**
 * Cria um cliente no AbacatePay
 */
export async function createCustomer({
    name,
    cellphone,
    email,
    taxId,
}: CreateCustomerParams): Promise<CustomerResponse> {
    const apiKey = process.env.ABACATEPAY_API_KEY

    if (!apiKey) {
        throw new Error('ABACATEPAY_API_KEY não configurada no .env.local')
    }

    try {
        const response = await fetch(`${ABACATEPAY_API_URL}/customer/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                name,
                cellphone,
                email,
                taxId,
            }),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Erro ao criar cliente')
        }

        const result = await response.json()

        return {
            id: result.data.id,
            metadata: result.data.metadata,
        }
    } catch (error) {
        console.error('Erro ao criar cliente:', error)
        throw error
    }
}

/**
 * Cria um QR Code PIX para pagamento
 */
export async function createPixQrCode({
    assetId,
    assetTitle,
    price,
    userId,
    userEmail,
    userName,
    userPhone,
    userTaxId,
    customerId,
}: CreatePixQrCodeParams): Promise<PixQrCodeResponse> {
    const apiKey = process.env.ABACATEPAY_API_KEY

    if (!apiKey) {
        throw new Error('ABACATEPAY_API_KEY não configurada no .env.local')
    }

    try {
        const amountInCents = Math.round(Number(price) * 100) // Garantir number e converter para centavos

        // Remover caracteres especiais e acentos da descrição para evitar erro no payload do PIX
        const cleanDescription = assetTitle
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "") // Remove acentos
            .replace(/[^a-zA-Z0-9 ]/g, "") // Remove tudo que não for letra, número ou espaço
            .substring(0, 30) // Limite seguro de caracteres

        console.log(`[AbacatePay] Criando PIX: ${cleanDescription} - R$ ${price} (${amountInCents} centavos)`)

        const payload: any = {
            amount: amountInCents,
            expiresIn: 3600, // 1 hora
            description: cleanDescription,
            metadata: {
                externalId: assetId,
                user_id: userId,
                asset_id: assetId,
            },
        }

        // Se tiver customerId, usar ele. Caso contrário, criar customer inline se tiver todos os dados
        if (customerId) {
            payload.customerId = customerId
        } else if (userName && userEmail && userPhone && userTaxId) {
            // Sanitizar dados (remover caracteres não numéricos)
            const sanitizedTaxId = userTaxId.replace(/\D/g, '')
            const sanitizedPhone = userPhone.replace(/\D/g, '')
            const cleanEmail = userEmail.trim()

            if (sanitizedTaxId.length >= 11) {
                payload.customer = {
                    name: userName,
                    email: cleanEmail,
                    cellphone: sanitizedPhone,
                    taxId: sanitizedTaxId,
                }
            } else {
                console.warn('[AbacatePay] TaxId inválido ou curto demais, enviando PIX sem cliente vinculado.')
            }
        }

        console.log('[AbacatePay] Payload Final:', JSON.stringify(payload, null, 2))

        const response = await fetch(`${ABACATEPAY_API_URL}/pixQrCode/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Erro ao criar QR Code PIX')
        }

        const result = await response.json()

        return {
            id: result.data.id,
            amount: result.data.amount,
            status: result.data.status,
            brCode: result.data.brCode,
            brCodeBase64: result.data.brCodeBase64,
            expiresAt: result.data.expiresAt,
        }
    } catch (error) {
        console.error('Erro ao criar QR Code PIX:', error)
        throw error
    }
}

/**
 * Verifica a assinatura do webhook do AbacatePay
 */
export function verifyWebhookSignature(
    payload: string,
    signature: string
): boolean {
    const secret = process.env.ABACATEPAY_WEBHOOK_SECRET

    if (!secret) {
        console.error('ABACATEPAY_WEBHOOK_SECRET não configurado')
        return false
    }

    // AbacatePay usa HMAC SHA256 para assinar webhooks
    const crypto = require('crypto')
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex')

    return signature === expectedSignature
}
