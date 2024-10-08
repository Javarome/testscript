export class Expression {
  protected negated = false;

  get not(): Expression {
    this.negated = true;
    return this;
  }
}
