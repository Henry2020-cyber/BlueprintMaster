
import { describe, it, expect } from 'vitest'
import { cn } from '../lib/utils'

describe('Utils', () => {
    it('cn should merge classes correctly', () => {
        expect(cn('w-full', 'p-4')).toBe('w-full p-4')
        expect(cn('w-full', 'w-1/2')).toBe('w-1/2')
    })
})

describe('Sanity Check', () => {
    it('should pass', () => {
        expect(true).toBe(true)
    })
})
