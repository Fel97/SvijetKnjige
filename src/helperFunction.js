import store from "./store";

const getBookNameByISBN = (unnum) => {
  let filteredBooks = store.books.filter((book) => book.unnum == unnum);
  return filteredBooks[0].title;
};
const getUserEamil = () => {
  return store.activeUser;
};

const getUserById = (id) => {
  const user = store.users.filter((user) => user.userId == id);
  return user[0];
};

const isAdmin = () => {
  return store.activeUser === "admin@admin.com";
};

const isUser = () => {
  return store.activeUser !== "admin@admin.com";
};

const getGenre = (id) => {
  const genre = store.genres.filter((genre) => genre.id == id);
  return genre[0].name;
};

const getAutor = (id) => {
  const autor = store.autors.filter((autor) => autor.id == id);
  return autor[0].firstname + " " + autor[0].lastname;
};

const myAdvancedFilter = () => {
  const myBooks = [];

  store.books.forEach(book => {   
    if(getNumberOfAvailableBooks(book) > 0){
      if(book.active){
        myBooks.push(book)
      }
    }
  });
  
  return myBooks;
};

const getNumberOfAvailableBooks = (book) => {
  let numberOfRezervations = 0;
  store.rezervations.forEach(rezervation => {
    if(rezervation.unnum == book.unnum){
      if(rezervation.status == 'created' || rezervation.status == 'shipped'){
        numberOfRezervations++;
      }
    }
  });
  return +book.numOfBooks - +numberOfRezervations;
}

const  getISBN = () =>  {
  return "xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export {
  getBookNameByISBN,
  getUserEamil,
  isAdmin,
  isUser,
  getGenre,
  getAutor,
  getUserById,
  myAdvancedFilter,
  getISBN,
  getNumberOfAvailableBooks
};
