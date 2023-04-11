class User {
  var Email: array<char>;
  var Password: array<char>;
  var UserName: array<char>;

  constructor(email: array<char>, password: array<char>, userName: array<char>) {
    this.Email := email;
    this.Password := password;
    this.UserName := userName;
  }
}

class WineProgram {
  var users: set<User>;

  constructor(users: set<User>)
  modifies users
  {
    this.users := users;
  }

  static method IsUnique(user: User, users: set<User>) 
  returns (r: bool)
  {
    r := user !in users;
  }

  method ContainsAt(a: array<char>) 
  returns (r: bool)
  {
    var index := 0;
    while index < a.Length
      invariant 0 <= index <= a.Length
      invariant forall k :: 0 <= k < index ==> a[k] != '@'
    {
      if a[index] == '@' { return true; }
      index := index + 1;
    }

    return false;
  }
  
  method RegisterUser(user: User)
  returns (res: bool)
  modifies this
  {
    var unique := IsUnique(user, this.users);
    var correctEmail := ContainsAt(user.Email);
    var correctPassword := user.Password.Length >= 8;
    var correctUsername := user.UserName.Length >= 3;

    if (unique || correctPassword || correctUsername) {
      return false;
    }

    this.users := this.users + {user};
    res := user in this.users;
    return true;
  }
}
