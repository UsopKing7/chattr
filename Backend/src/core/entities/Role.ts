import { RoleType } from '../enums/RoleType'

export class Role {
  constructor(public name: RoleType, public id_role: string) {}

  getIdRole(): string {
    return this.id_role
  }
  getName(): RoleType {
    return this.name
  }
}
