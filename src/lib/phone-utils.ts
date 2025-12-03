export function phoneMask(value: string): string {
  if (value.startsWith("+")) {
    const digits = value.slice(1).replace(/\D/g, "").slice(0, 15)
    return `+${digits}`
  }
  
  const digits = value.replace(/\D/g, "").slice(0, 10)
  
  if (digits.length === 0) return ""
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export function phoneToE164(value: string): string {
  if (value.startsWith("+")) {
    const digits = value.slice(1).replace(/\D/g, "")
    return digits.length > 0 ? `+${digits}` : ""
  }
  
  const digits = value.replace(/\D/g, "")
  if (digits.length === 0) return ""
  return `+1${digits}`
}

