import { User } from './user';
export class Utils {

  static reverseSortById(data: any[]): any[] {
    return data.sort((a, b) => {
      if (a.id < b.id) {
        return 1;
      }
      if (a.id > b.id) {
        return -1;
      }
      return 0;
    });
  }

  static sortById(data: any[]): any[] {
    return data.sort((a, b) => {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      return 0;
    });
  }

  static sortByAlias(users: User[]): any[] {
    return users.sort((a, b) => {
      if (a.alias.toLowerCase() > b.alias.toLowerCase()) {
        return 1;
      }
      if (a.alias.toLowerCase() < b.alias.toLowerCase()) {
        return -1;
      }
      return 0;
    });
  }


  static sortByName(data: any[]): any[] {
    return data.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
  }
}
