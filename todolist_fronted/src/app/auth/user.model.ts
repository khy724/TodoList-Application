export class User {
  constructor(
    public email: string,
    public id: string,
    private accesstoken: string,
    private refreshtoken: string,
    
  ) {}

  // get token() {
  //   // if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
  //   //   return null;
  //   // }
  //   // return this.accesstoken;
  // }
}
