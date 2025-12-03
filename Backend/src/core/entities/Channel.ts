import { NameOV } from "../value-objects/NameOV";

export class Channel {
  constructor(
    public name: NameOV,
    public description: string,
    public id_user_owner: string,
    public readonly id_channel?: string
  ) {}

  updateName(newName: NameOV) { this.name = newName }
  updateDescription(newDescription: string) { this.description = newDescription }

  get getPublicData() {
    return {
      id_channel: this.id_channel,
      name: this.name.value,
      description: this.description,
      id_user_owner: this.id_user_owner
    }
  }
}
