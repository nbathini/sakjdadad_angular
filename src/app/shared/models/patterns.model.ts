export class Patterns {
    emailPattern: RegExp;
    telPattern: RegExp;
    urlPattern: RegExp;
    constructor() {
        this.emailPattern = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/);
        this.telPattern = new RegExp(/^\(\d{3}\)\s?\d{3}-\d{4}$|^\d{10}$/);
      //  this.telPattern = new RegExp(/^\+?1\s?\(?(?:[2-9][0-8][0-9]|[2-9][0-9]{2})\)?[\s.-]?\d{3}[\s.-]?\d{4}$/);
        
    //    this.telPattern = new RegExp(/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/);
    //    this.telPattern = new RegExp(/^(\+\d{1,3}\s?)?\d{1,4}[\s.-]?\(?\d{1,3}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}$/);
        this.urlPattern = new RegExp(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/);
    }
}
