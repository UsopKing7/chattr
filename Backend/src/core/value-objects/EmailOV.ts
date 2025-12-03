export class EmailVO {
  constructor(public readonly value: string) {
    if (!value) throw new Error('Email is required')
    if (typeof value !== 'string') throw new Error('Email must be a string')
    if (!value.includes('@')) throw new Error('Email must be a valid email')
    if (!value.includes('.')) throw new Error('Email must be a valid email')
    this.value = value
  }
}