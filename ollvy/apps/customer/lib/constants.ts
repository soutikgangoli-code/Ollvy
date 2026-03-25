// App-wide constants

// Support contact numbers
export const SUPPORT_WHATSAPP = '917042100461'
export const SUPPORT_PHONE = '+917042100461'

// WhatsApp message link generator
export function getWhatsAppLink(message: string): string {
  return `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(message)}`
}

// Phone call link
export function getPhoneLink(): string {
  return `tel:${SUPPORT_PHONE}`
}
