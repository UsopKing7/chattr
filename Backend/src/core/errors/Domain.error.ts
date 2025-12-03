export class DomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DomainError'
  }
}

export class DomainErrorChannel extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DomainErrorChannel'
  }
}
