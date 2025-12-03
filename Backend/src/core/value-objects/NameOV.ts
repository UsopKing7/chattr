export class NameOV {
  constructor(public readonly value: string) {
    if (!value) throw new Error('Name is required')
    if (typeof value !== 'string') throw new Error('Name must be a string')
    if (value.length < 3) throw new Error('Name must be at least 3 characters')
    
    this.value = value
  }
}