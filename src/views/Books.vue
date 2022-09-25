<template>
  <div>
    <div style="padding-bottom: 25px">
      <div v-if="store.books.length == 0" class="d-flex">
        <h3>No Books in the database</h3>
      </div>
      <div class="d-flex">
        <input
          v-model="searchTerm"
          class="form-control me-2"
          type="search"
          placeholder="Pretraga"
          aria-label="Search"
        />
        <button
          class="btn btn-outline-success me-2"
          v-on:click="searchButtonClicked"
        >
          Pretraga
        </button>

        <button
          @click="createButtonClicked"
          v-if="store.isadmin"
          type="button"
          class="btn btn-outline-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Create
        </button>
      </div>
    </div>

    <Alert
      v-if="this.quantity > 0"
      :error="store.error"
      :dismisClicked="dismis"
    />

    <div v-if="this.filteredBooks.length > 0">
      <Book
        v-for="book in filteredBooks"
        :store="store"
        :key="book.id"
        :book="book"
        :addBookClicked="plusIconClicked"
        :editBookClicked="editIconClicked"
        :deleteBookClicked="deleteIconClicked"
      />
    </div>

    <!-- Add Book Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5
              v-if="this.bookaction == 'add'"
              class="modal-title"
              id="exampleModalLabel"
            >
              Add new Book to the library
            </h5>
            <h5
              v-if="this.bookaction == 'edit'"
              class="modal-title"
              id="exampleModalLabel"
            >
              Edit Book
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <form>
              <Alert :error="store.error" :dismisClicked="dismis" />
              <div v-if="this.imageurl" class="col-md-4">
                <img
                  :src="this.imageurl"
                  class="card-img-top"
                  :alt="'Naslov'"
                  width="30px"
                />
              </div>

              <div class="mb-3">
                <label for="bookNameControlInputThree" class="form-label"
                  >Title</label
                >
                <input
                  v-model="title"
                  class="form-control"
                  id="bookNameControlInputThree"
                />
              </div>

              <div class="mb-3">
                <label for="bookDescriptionControlTextarea" class="form-label"
                  >Description</label
                >
                <textarea
                  v-model="description"
                  class="form-control"
                  id="bookDescriptionControlTextarea"
                  rows="3"
                ></textarea>
              </div>

              <div class="mb-3">
                <label for="bookAutorControlInput" class="form-label"
                  >Autor</label
                >
                <div class="d-flex">
                  <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="autor"
                  >
                    <option
                      v-for="aut in store.autors"
                      v-bind:key="aut.id"
                      :value="aut"
                      :selected="aut.id == autor.id"
                      >{{ aut.firstname + " " + aut.lastname }}</option
                    >
                  </select>

                  <button
                    data-bs-toggle="modal"
                    data-bs-dismiss="modal"
                    data-bs-target="#exampleModalTwo"
                    type="button"
                    class="btn btn-success fa fa-plus ms-2"
                    @click="addAutorClicked"
                  ></button>
                  <button
                    v-if="autor != undefined"
                    data-bs-toggle="modal"
                    data-bs-dismiss="modal"
                    data-bs-target="#exampleModalTwo"
                    type="button"
                    class="btn btn-primary fa fa-pencil ms-2"
                    @click="editAutorClicked"
                  ></button>
                  <button
                    v-if="autor != undefined"
                    type="button"
                    class="btn btn-danger fa fa-trash ms-2"
                    @click="deleteAutorClicked"
                  ></button>
                </div>
              </div>

              <div class="mb-3">
                <label for="bookGenreControlInput" class="form-label"
                  >Genre</label
                >
                <div class="d-flex">
                  <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="genre"
                  >
                    <option
                      v-for="gen in store.genres"
                      v-bind:key="gen.id"
                      :value="gen"
                      :selected="gen.id == genre.id"
                      >{{ gen.name }}</option
                    >
                  </select>

                  <button
                    data-bs-toggle="modal"
                    data-bs-dismiss="modal"
                    data-bs-target="#exampleModalThree"
                    type="button"
                    class="btn btn-success fa fa-plus ms-2"
                    @click="addGenreClicked"
                  ></button>
                  <button
                    v-if="genre != undefined"
                    data-bs-toggle="modal"
                    data-bs-dismiss="modal"
                    data-bs-target="#exampleModalThree"
                    type="button"
                    class="btn btn-primary fa fa-pencil ms-2"
                    @click="editGenreClicked"
                  ></button>

                  <button
                    v-if="genre != undefined"
                    type="button"
                    class="btn btn-danger fa fa-trash ms-2"
                    @click="deleteGenreClicked"
                  ></button>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Book Cover Image</label>
                <input
                  type="file"
                  class="form-control"
                  @change="onFilePicked"
                  accept="image/png, image/jpeg, image/jpg"
                />
              </div>

              <div v-if="bookaction == 'add'" class="mb-3">
                <label for="bookQuantityControlInputForm" class="form-label"
                  >Quantity of books</label
                >
                <input
                  v-model="numOfBooks"
                  type="number"
                  class="form-control"
                  id="bookQuantityControlInputForm"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              v-if="bookaction == 'add'"
              @click="saveBook"
              type="button"
              class="btn btn-success"
            >
              Save
            </button>
            <button
              v-if="bookaction == 'edit'"
              @click="editBook"
              type="button"
              class="btn btn-primary"
            >
              <div>
                Edit
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- End of Add Book modal -->

    <!-- Add Autor Modal -->
    <div
      class="modal fade"
      id="exampleModalTwo"
      tabindex="-1"
      aria-labelledby="exampleModalTwoLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalTwoLabel">
              <div v-if="action == 'add'">
                Add new Autor
              </div>
              <div v-if="action == 'edit'">
                Edit Autor
              </div>
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <form>
              <Alert :error="store.error" :dismisClicked="dismis" />
              <div class="mb-3">
                <label for="bookNameControlInput" class="form-label"
                  >First name</label
                >
                <input
                  v-model="firstname"
                  class="form-control"
                  id="bookNameControlInput"
                />
              </div>

              <div class="mb-3">
                <label for="bookNameControlInputTwo" class="form-label"
                  >Last name</label
                >
                <input
                  v-model="lastname"
                  class="form-control"
                  id="bookNameControlInputTwo"
                />
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <button @click="addAutor" type="button" class="btn btn-primary">
              <div v-if="action == 'add'">
                Add Autor
              </div>
              <div v-if="action == 'edit'">
                Edit Autor
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- End of Add Autor Modal -->

    <!-- Add Genre Modal -->
    <div
      class="modal fade"
      id="exampleModalThree"
      tabindex="-1"
      aria-labelledby="exampleModalThreeLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalTwoLabel">
              <div v-if="genreAction == 'add'">
                Add new Genre
              </div>
              <div v-if="genreAction == 'edit'">
                Edit Genre
              </div>
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <form>
              <Alert :error="store.error" :dismisClicked="dismis" />
              <div class="mb-3">
                <label for="bookGenreControlInput" class="form-label"
                  >Name</label
                >
                <input
                  v-model="name"
                  class="form-control"
                  id="bookGenreControlInput"
                />
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <button @click="addGenre" type="button" class="btn btn-primary">
              <div v-if="genreAction == 'add'">
                Add Genre
              </div>
              <div v-if="genreAction == 'edit'">
                Edit Genre
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- End of Add Genre Modal -->

    <!-- Add Book Modal -->
    <div
      class="modal fade"
      id="exampleModalFour"
      tabindex="-1"
      aria-labelledby="exampleModalFourLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalFourLabel">
              Add new Books
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              data-bs-toggle="modal"
              data-bs-target="#exampleModalFour"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <form>
              <Alert :error="store.error" :dismisClicked="dismis" />
              <div class="mb-3">
                <label for="bookGenreControlInput" class="form-label"
                  >Quantity</label
                >
                <input
                  v-model="quantity"
                  class="form-control"
                  id="bookQuantityControlInput"
                />
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <button @click="addNewBooks" type="button" class="btn btn-primary">
              <div>
                Add new books
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- End of Add Genre Modal -->
  </div>
</template>

<script>
import Alert from "../components/Alert";
import Book from "../components/Book";
import store from "../store";
import { isAdmin, myAdvancedFilter, getISBN } from "../helperFunction";
import * as firebase from "firebase";
import { saveFbObject, editFbObject, deleteFbObject } from "../firebase";

export default {
  name: "Books",
  data() {
    return {
      store,
      
      action: "add",
      bookaction: "add",
      genreAction: "add",

      searchTerm: "",
      filteredBooks: store.isadmin ? store.books : myAdvancedFilter(),

      firstname: "",
      lastname: "",
      autor: store.autors[0] != undefined ? store.autors[0] : undefined,

      name: "",
      genre: store.genres[0] != undefined ? store.genres[0] : undefined,

      title: "",
      description: "",
      filePicked: false,
      filePickerValue: [],
      imageurl: "",
      image: undefined,
      numOfBooks: 0,
      quantity: 1,
      book: undefined,
    };
  },
  beforeCreate: function() {
    this.filteredBooks = store.books || [];
  },

  components: { 
    Book,
    Alert 
  },

  methods: {
    async editBook() {
      if (this.filePicked) {
        const filename = this.image.name;
        const fileData = await firebase.default
          .storage()
          .ref("images/" + filename)
          .put(this.image);

        const url = await firebase.default
          .storage()
          .ref()
          .child(fileData.metadata.fullPath)
          .getDownloadURL();

        this.imageurl = url;
      } else {
        this.imageurl = this.book.imageurl;
      }

      try {
        const objectForEdit = {
          autor: this.autor.id,
          description: this.description,
          genre: this.genre.id,
          imageurl: this.imageurl,
          numOfBooks: this.book.numOfBooks,
          title: this.title,
          unnum: this.book.unnum,
          userId: store.userId,
        }

        const editBookRes = await editFbObject('books', objectForEdit, this.book.id, store.token)

        if (editBookRes.status == 200) {
          store.books.forEach(book => {
            if(book.id == this.book.id){
              book.title = this.title;
              book.description = this.description;
              book.autor = this.autor.id;
              book.genre = this.genre.id;
              book.imageurl = this.imageurl;
            }
          });
          $("#exampleModal").modal("hide");
        }
      } catch (error) {
        store.error = error.message;
      }
    },

    createButtonClicked() {
      this.title = "";
      this.description = "";
      this.quantity = 0;
      this.bookaction = "add";
    },

    editIconClicked(id) {
      $("#exampleModal").modal("show");
      this.bookaction = "edit";
      let booksArray = store.books.filter((book) => book.id == id);

      const selectedBook = booksArray[0];

      this.title = selectedBook.title;
      this.description = selectedBook.description;
      let autorsArray = store.autors.filter((autor) => autor.id == selectedBook.autor);
      this.autor = autorsArray[0];
      let genresArray = store.genres.filter((genre) => genre.id == selectedBook.genre);
      this.genre = genresArray[0];
      this.book = booksArray[0];
      this.filePicked = false;
    },

    async addNewBooks() {
      if (this.quantity == 0) {
        store.error = "Quantity must be greather than 0";
        return;
      }

      try {
        const booksRes = await editFbObject('books', {
          autor: this.book.autor,
          description: this.book.description,
          genre: this.book.genre,
          imageurl: this.book.imageurl,
          numOfBooks: +this.book.numOfBooks + +this.quantity,
          title: this.book.title,
          unnum: this.book.unnum,
          userId: store.userId,
        }, this.book.id, store.token);

        if (booksRes.status == 200) {
          
          store.books.forEach(book => {
            if(book.id == this.book.id){
              book.numOfBooks = +this.book.numOfBooks + +this.quantity
            }
          });

          this.quantity = 0;
          $("#exampleModalFour").modal("hide");
        }
      } catch (error) {
        store.error = error.message;
      }
    },
    plusIconClicked(id) {
      let mybooks = this.store.books.filter((book) => book.id == id);
      this.book = mybooks[0];
      $("#exampleModalFour").modal("show");
    },

    async deleteIconClicked(book) {
      try {
        let deleteAction = true;

        store.rezervations.forEach(rezervation => {
          if(rezervation.unnum == book.unnum){
            deleteAction = false;
          }
        });
        if(deleteAction){
          const deleteBookResult = await deleteFbObject('books', book.id, store.token);
          if (deleteBookResult.status == 200) {
            const bookArray = store.books.filter(
              (b) => b.id != book.id
            );
            store.books = bookArray;
            this.filteredBooks = bookArray;
          }
        }else{
          store.error = 'Not allowed to delete'
        }

      } catch (error) {
        store.error = error.message;
      }
    },
    async addAutor() {
      if (this.action == "add") {
        try {
          var res = await saveFbObject("autors", {
            firstname: this.firstname,
            lastname: this.lastname
          }, store.userId, store.token)
          
          const newAutor = {
            id: res.data.name,
            firstname: this.firstname,
            lastname: this.lastname
          }

          if (res.status == 200) {
            this.firstname = "";
            this.lastname = "";
            this.store.autors.push(newAutor);
            this.autor = newAutor;

            $("#exampleModalTwo").modal("hide");
            $("#exampleModal").modal("show");
          }
        } catch (error) {
          store.error = error.message;
        }
      } else {
        try {
          const objectForEdit = {
            firstname: this.firstname,
            lastname: this.lastname,
            userId: store.userId,
          }

          var editResponse = await editFbObject('autors', objectForEdit, this.autor.id, store.token);

          if (editResponse.status == 200) {
            this.autor.firstname = this.firstname;
            this.autor.lastname = this.lastname;
            $("#exampleModalTwo").modal("hide");
            $("#exampleModal").modal("show");
          }
        } catch (error) {
          store.error = error.message;
        }
      }
    },
    async addGenre() {
      if (this.genreAction == "add") {
        try {
          var res = await saveFbObject("genres", {
            name: this.name
          }, store.userId, store.token);

          const newGenre = {
            id: res.data.name,
            name: this.name,
          }

          if (res.status == 200) {
            this.name = "";
            this.genre = newGenre;
            this.store.genres.push(newGenre);
            $("#exampleModalThree").modal("hide");
            $("#exampleModal").modal("show");
          }
        } catch (error) {
          store.error = error.message;
        }
      } else {
        try {

          let editedObject = {
            name: this.name,
            userId: store.userId,
          }
          var editResponse = await editFbObject('genres', editedObject, this.genre.id, store.token);
          if (editResponse.status == 200) {
            this.genre.name = this.name;
            $("#exampleModalThree").modal("hide");
            $("#exampleModal").modal("show");
          }
        } catch (error) {
          store.error = error.message;
        }
      }
    },
    searchButtonClicked() {
      if (this.searchTerm != "") {
        this.filteredBooks = store.books.filter((book) =>
          book.title.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        return;
      }
      this.filteredBooks = store.books;
    },
    async saveBook () {
      this.bookaction = "add";
      if (this.title == "") {
        store.error = "Title is required";
        return;
      }

      if (this.description == "") {
        store.error = "Description is required";
        return;
      }

      if (this.autor == undefined) {
        store.error = "Autor is required";
        return;
      }

      if (this.genre == undefined) {
        store.error = "Genre is required";
        return;
      }

      if (this.filePicked == false) {
        store.error = "Image is required";
        return;
      }

      const filename = this.image.name;

      try{
        const fileData = await firebase.default
          .storage()
          .ref("images/" + filename)
          .put(this.image)
        
        const url = await firebase.default
          .storage()
          .ref()
          .child(fileData.metadata.fullPath)
          .getDownloadURL();
        
        this.imageurl = url;
        let newBook = {
          title: this.title,
          description: this.description,
          imageurl: this.imageurl,
          autor: this.autor.id,
          genre: this.genre.id,
          numOfBooks: this.numOfBooks,
          unnum: getISBN(),
          active: true,
        }
        const booksResult =  await saveFbObject("books", newBook, store.userId, store.token)
        newBook.id = booksResult.data.name
        let book = newBook;
        store.books.push(book);
        
        this.title = "";
        this.description = "";
        this.filePicked = false;
        this.imageurl = undefined;
        this.image = undefined;
        this.numOfBooks = 0;
        $("#exampleModal").modal("hide");
      }catch(error){
        console.log(error)
        store.error = error;
      }
    },
    dismis() {
      store.error = "";
    },

    addAutorClicked() {
      this.action = "add";
      this.firstname = "";
      this.lastname = "";
    },
    editAutorClicked() {
      this.action = "edit";
      this.firstname = this.autor.firstname;
      this.lastname = this.autor.lastname;
    },
    addGenreClicked() {
      this.genreAction = "add";
      this.name = "";
    },
    editGenreClicked() {
      this.genreAction = "edit";
      this.name = this.genre.name;
    },
    async deleteAutorClicked() {

      let deleteAction = true;

      store.books.forEach(book => {
        if (book.autor == this.autor.id) {
          deleteAction = false;
        }
      });

      if (deleteAction) {
        try {
          var deleteAutorResponse = await deleteFbObject('autors', this.autor.id, store.token);
          if (deleteAutorResponse.status == 200) {
            this.store.autors = this.store.autors.filter(
              (autor) => autor.id !== this.autor.id
            );
            this.autor = this.store.autors[0];
          }
        } catch (error) {
          store.error = error.message;
        }
      }else{
        store.error = 'this autor is not allowed to delete!'
      }
    },

    async deleteGenreClicked() {
      let deleteAction = true;

      store.books.forEach(book => {
        if(book.genre == this.genre.id){
          deleteAction = false;
        }
      });

      if(deleteAction){
        try {
          var deleteGenreResponse = await deleteFbObject('genres', this.genre.id, store.token);
          if (deleteGenreResponse.status == 200) {
            this.store.genres = this.store.genres.filter(
              (genre) => genre.id !== this.genre.id
            );
            this.genre = this.store.genres[0];
          }
        } catch (error) {
          store.error = error.message;
        }
      }else{
        store.error = 'this genre is not allowed to delete!'
      }
    },
    onFilePicked(event) {
      const files = event.target.files;
      if (files.length > 0) {
        let filename = files[0].name;
        if (filename.lastIndexOf(".") <= 0) {
          this.filePicked = false;
          this.imageurl = undefined;
          this.image = undefined;
          state.error = "Please add a valid file!";
          return;
        } else {
          this.filePicked = true;
          const fileReader = new FileReader();
          fileReader.addEventListener("load", () => {
            this.imageurl = fileReader.result;
          });
          fileReader.readAsDataURL(files[0]);
          this.image = files[0];
        }
      } else {
        this.filePicked = false;
        this.imageurl = undefined;
        this.image = undefined;
      }
    },
  },
  computed: {
    isAdmin() {
      return isAdmin();
    },
  },
};
</script>
