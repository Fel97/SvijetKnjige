<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand">Knjižnica</a>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link
                class="nav-link"
                active-class="active"
                to="/books"
                exact
                >Knjige</router-link
              >
            </li>
            <li class="nav-item" v-if="store.logged == true">
              <router-link
                class="nav-link"
                active-class="active"
                to="/rezervations"
                >Rezervacije</router-link
              >
            </li>
          </ul>
        </div>
        <span v-if="store.logged == false" class="navbar-text">
          <router-link class="nav-link" to="/login" active-class="active"
            >Prijava</router-link
          >
        </span>

        <span v-if="store.logged == false" class="navbar-text">
          <router-link class="nav-link" to="/register" active-class="active"
            >Registracija</router-link
          >
        </span>

        <span
          v-if="store.logged == true"
          class="navbar-text"
          v-on:click="loggout"
        >
          <router-link class="nav-link" to="/login">Odjava </router-link>
        </span>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>

    <div class="container">
      <div class="row" style="margin-top: 20px;">
        <div class="col-2" />
        <div class="col-8">
          <router-view />
        </div>
        <div class="col-2" />
      </div>
    </div>

    <footer class="row">
      <p class="col ms-3">Copyright &copy; {{ new Date().getFullYear() }}</p>
      <p v-if="store.logged == true" class="col  d-flex justify-content-end">
        {{ getUser }}
      </p>
    </footer>
  </div>
</template>
<script>
import store from "./store";
import { getUserEamil, isAdmin } from "./helperFunction";

export default {
  name: "App",
  data() {
    return {
      store,
    };
  },
  methods: {
    loggout() {
      store.logged = false;
      store.token = "";
    },
  },
  computed: {
    getUser() {
      return getUserEamil();
    },
    isAdmin() {
      return isAdmin();
    },
  },
};
</script>

<style>
footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
