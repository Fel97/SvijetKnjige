<template>
  <div>
    <div
      class="container"
      v-if="
        store.books.filter((book) => book.id == $route.params.id).length >
          0
      "
    >
      <div class="row align-items-center">
        <div class="col-9">
          <img :src="getBook($route.params.id).imageurl" width="150spx" />
        </div>
      </div>
      <div class="row">
        <h1>{{ getBook($route.params.id).title }}</h1>
        <h4>
          {{ getBook($route.params.id).description }},
          {{ getAutor(getBook($route.params.id).autor) }},
          {{ getGenre(getBook($route.params.id).genre) }}
        </h4>
      </div>

      <Alert :error="store.error" :dismisClicked="dismis" />

      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">ISBN</th>
            <th scope="col">Availability</th>
            <th v-if="store.isadmin == false" scope="col">Rezervation</th>
            <th v-if="store.isadmin == true" scope="col">Delete</th>
            <th v-if="store.isadmin == true" scope="col">Active</th>
            <th v-if="store.isadmin == true" scope="col">Deactivate</th>
          </tr>
        </thead>
        <tbody v-if="store.isadmin">
          <tr
            v-for="book in store.books.filter(
              (book) => book.id == $route.params.id
            )"
            :key="book.id"
          >
            <th scope="row">{{ book.id.substring(0, 6) }}</th>
            <td>{{ book.unnum }}</td>
            <td>{{ getNumberOfAvailableBooks(book) > 0 ? "yes" : "no" }}</td>
            <td v-if="store.isadmin == false">
              <div
                class="btn btn-primary fa fa-plus"
                @click="addRezervationClicked(book)"
              />
            </td>
            <td v-if="store.isadmin == true">
              <div
                class="btn btn-danger fa fa-trash"
                @click="deleteBookClicked(book)"
              />
            </td>
            <td v-if="store.isadmin == true">
              <div v-if="book.active" class=" fa fa-check"></div>
              <div v-if="!book.active" class=" fa fa-times"></div>
            </td>
            <td v-if="store.isadmin == true">
              <div
                v-if="book.active"
                class="btn btn-danger fa fa-trash"
                @click="deactivateBookClicked(book)"
              />
            </td>
          </tr>
        </tbody>

        <tbody v-if="store.isadmin == false">
          <tr
            v-for="book in store.books.filter(
              (book) => book.id == $route.params.id
            )"
            :key="book.id"
          >
            <th scope="row">{{ book.id }}</th>
            <td>{{ book.unnum }}</td>
            <td>{{ getNumberOfAvailableBooks(book) > 0 ? 'yes': 'no'  }}</td>
            <td>
              <div
                v-if="store.isadmin == false && getNumberOfAvailableBooks(book) > 0"
                class="btn btn-primary fa fa-plus"
                @click="addRezervationClicked(book)"
              />
            </td>
            <td v-if="store.isadmin == true">
              <div
                class="btn btn-danger fa fa-trash"
                @click="deleteBookClicked(book)"
              />
            </td>
            <td v-if="store.isadmin == true">
              <div v-if="book.active" class=" fa fa-check"></div>
              <div v-if="!book.active" class=" fa fa-times"></div>
            </td>
            <td v-if="store.isadmin == true">
              <div
                v-if="book.active"
                class="btn btn-danger fa fa-trash"
                @click="deactivateBookClicked(book)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import store from "../store";
import Alert from "../components/Alert.vue";
import { getAutor, getGenre, getNumberOfAvailableBooks } from "../helperFunction";
import { saveFbObject, deleteFbObject, editFbObject } from "../firebase";

export default {
  name: "Home",
  data() {
    return {
      store,
    };
  },
  components: { Alert },
  methods: {
    async deactivateBookClicked(book) {
      try {
        const objectForEdit = {
          active: false,
          autor: book.autor,
          description: book.description,
          genre: book.genre,
          imageurl: book.imageurl,
          numOfBooks: book.numOfBooks,
          title: book.title,
          unnum: book.unnum,
          userId: book.userId,
        }
        const editBookRes = await editFbObject('books', objectForEdit, book.id, store.token)

        if (editBookRes.status == 200) {
          store.books.forEach(b => {
            if (b.id == book.id) {
              b.active = false;
            }
          });
        }
      } catch (error) {
        store.error = error.message;
      }
    },
    async addRezervationClicked(book) {
      try {

        let newRezervation = {
          userId: store.userId,
          startdate: new Date().toString(),
          enddate: null,
          unnum: book.unnum,
          status: 'created'
        }

        const addRezervationResult = await saveFbObject('rezervations', newRezervation, store.userId, store.token );
        newRezervation.id = addRezervationResult.data.name;

        store.rezervations.push(newRezervation);
      } catch (error) {
        store.error = error.message;
      }
    },
    async deleteBookClicked(book) {
      try {
        let deleteAction = true;

        store.rezervations.forEach(rezervation => {
          if (rezervation.unnum == book.unnum) {
            deleteAction = false;
          }
        });
        if (deleteAction) {
          const deleteBookResult = await deleteFbObject('books', book.id, store.token);
          if (deleteBookResult.status == 200) {
            const bookArray = store.books.filter(
              (b) => b.id != book.id
            );
            store.books = bookArray;
            this.filteredBooks = bookArray;
          }
          this.$router.go(-1);
        } else {
          store.error = 'Not allowed to delete'
        }

      } catch (error) {
        store.error = error.message;
      }
    },
    getAutor(id) {
      return getAutor(id);
    },
    getGenre(id) {
      return getGenre(id);
    },
    getNumberOfAvailableBooks(book){
      return getNumberOfAvailableBooks(book)
    },
    getBook(id) {
      let books = store.books.filter((book) => book.id == id);
      return books[0];
    },
    dismis() {
      store.error = "";
    },
    notAvailable(book){
      let indicator = false;
      store.rezervations.forEach(rez => {
        if(rez.userId == store.userId && rez.unnum == book.unnum){
          if(rez.status == 'created' || rez.status == 'shipped' ){
            indicator = true;
          }
        } 
      });
      return indicator;
    }
  }
};
</script>
