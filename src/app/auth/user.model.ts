export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) { }
  get token() { //геттер для отримання токена
    if (!this._tokenExpirationDate || new Date > this._tokenExpirationDate) { //перевірка на наявність терміну валідності і чи термін не сплив
      return null;
    }
    return this._token;
  }
}