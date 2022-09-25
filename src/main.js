import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import * as firebase from "firebase";
import store from "./store";
import { getAllFbObjectsNoAuth } from "../src/firebase";

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
  async created() {
    firebase.default.initializeApp({
      apiKey: "AIzaSyA4UrUEvs0vZR1JZ4QvjXXIc5RiFN9WOfY",
      authDomain: "svijetknjiga-df663.firebaseapp.com",
      projectId: "svijetknjiga-df663",
      storageBucket: "svijetknjiga-df663.appspot.com",
      messagingSenderId: "384758077008",
      appId: "1:384758077008:web:cc152ba4eb045354a4a355",
      measurementId: "G-KL7TC7Z6LY"
    });
    const booksRes = await getAllFbObjectsNoAuth("books");
    store.books = booksRes;
    const genresRes = await getAllFbObjectsNoAuth("genres");
    store.genres = genresRes;
    const autorsRes = await getAllFbObjectsNoAuth("autors");
    store.autors = autorsRes;
    
    // if (this.$route.path !== "/books") {
    //   this.$router.push("books");
    // }
  },
}).$mount("#app");