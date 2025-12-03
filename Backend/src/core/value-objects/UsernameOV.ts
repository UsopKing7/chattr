export class UsernameOV {
  constructor(public readonly value: string) {
    if (!value) throw new Error('Username is required')
    if (typeof value !== 'string') throw new Error('Username must be a string')
    if (value.length < 3) throw new Error('Username must be at least 3 characters')
    
    this.value = value
  }
}
