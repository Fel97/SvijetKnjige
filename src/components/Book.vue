<template>
  <div class="card mb-3" style="max-width: 1000px;">
    <div class="row g-0">
      <div
        v-if="store.logged == true"
        class="col-md-4"
        @click="bookSelected(book.id)"
        style="cursor: pointer"
      >
        <img
          :src="book.imageurl"
          class="card-img-top"
          :alt="book.title"
          width="30px"
          height="240px"
        />
      </div>
      <div v-if="store.logged == false" class="col-md-4">
        <img
          :src="book.imageurl"
          class="card-img-top"
          :alt="book.title"
          width="30px"
          height="240"
        />
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <div class="row">
            <h5 class="card-title col">
              {{ book.title }}
            </h5>
            <h6 class="col  d-flex justify-content-end">
              Kol. {{ getNumberOfAvailableBooks(book) }}
            </h6>
          </div>

          <p class="card-text">
            {{ book.description }}
          </p>
          <p class="card-text">
            <small class="text-muted"
              >Žanr: {{ getFullGenre(book.genre) }}</small
            >
          </p>
          <p class="card-text">
            <small class="text-muted">ISBN: {{ book.unnum }}</small>
          </p>
          <div class="row">
            <div class="card-title col">
              <p class="card-text">
                <small class="text-muted"
                  >Autor: {{ getFullAutor(book.autor) }}</small
                >
              </p>
            </div>
            <div
              v-if="store.isadmin == true"
              class="col d-flex justify-content-end"
            >
              <div
                class="btn btn-success fa fa-plus me-2"
                @click="addBookClicked(book.id)"
              />
              <div
                class="btn btn-primary fa fa-pencil me-2"
                @click="editBookClicked(book.id)"
              />
              <div
                class="btn btn-danger fa fa-trash "
                @click="deleteBookClicked(book)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getGenre, getAutor, getNumberOfAvailableBooks  } from "../helperFunction";

export default {
  name: "Book",
  props: {
    store: Object,
    book: Object,
    addBookClicked: Function,
    editBookClicked: Function,
    deleteBookClicked: Function,
  },
  methods: {
    bookSelected(unnum) {
      this.$router.push({ path: `/book/${unnum}` });
    },
    getFullGenre(id) {
      return getGenre(id);
    },
    getFullAutor(autor) {
      return getAutor(autor);
    },
    getNumberOfAvailableBooks(book){
      return getNumberOfAvailableBooks(book)
    }
  },
  computed: {
    shortDesc() {
      var maxLength = 140;
      if (this.book.description != undefined) {
        if (this.book.description.length > maxLength) {
          return this.book.description.substring(0, maxLength) + "...";
        } else {
          return this.book.description;
        }
      } else {
        return "";
      }
    },
  },
  components: {},
};
</script>
