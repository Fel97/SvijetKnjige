<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col"></div>
        <div class="col-12">
          <form>
            <Alert :error="store.error" :dismisClicked="dismis" />
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label"
                >Email adresa</label
              >
              <input
                v-model="email"
                type="email"
                class="form-control"
                id="exampleFormControlInput1"
                placeholder="name@Primjer.com"
              />
            </div>

            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label"
                >Lozinka</label
              >
              <input
                v-model="password"
                type="password"
                class="form-control"
                id="exampleFormControlInput2"
                placeholder="password"
              />
            </div>

            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label"
                >Potvrdite lozinku</label
              >
              <input
                v-model="confirmPassword"
                type="password"
                class="form-control"
                id="exampleFormControlInput3"
                placeholder="password"
              />
            </div>

            <div class="col-12">
              <button
                type="button"
                class="btn btn-primary"
                v-on:click="register"
              >
                Registriraj se
              </button>
            </div>
          </form>
        </div>
        <div class="col"></div>
      </div>
    </div>
  </div>
</template>
<script>
import Alert from "../components/Alert.vue";
import router from "../router";
import store from "../store";
import { saveFbObject, getAllFbObjects, registerFbUser } from "../firebase";

export default {
  name: "Register",
  data() {
    return {
      store: store,
      email: "",
      password: "",
      confirmPassword: "",
    };
  },
  components: {
    Alert,
  },
  methods: {
    dismis() {
      store.error = "";
    },
    async register() {
      if (this.password != this.confirmPassword) {
        store.error = "Password are not match!";
        return;
      }

      try {
        const res = await registerFbUser(this.email, this.password);
        
        const {data} = res;
        const {idToken, localId} = data;
        
        store.activeUser = this.email;
        store.userId = localId;
        store.token = idToken;
        store.logged = true;
        
        const newUser = {
          email: this.email,
        }
        await saveFbObject('users', newUser, store.userId, store.token);

        const usersRes = await getAllFbObjects("users", idToken);
        store.users = usersRes;
        const autorsRes = await getAllFbObjects("autors", idToken);
        store.autors = autorsRes;
        const genresRes = await getAllFbObjects("genres", idToken);
        store.genres = genresRes;
        const booksRes = await getAllFbObjects("books", idToken);
        store.books = booksRes;
        const rezervationsRes = await getAllFbObjects("rezervations", idToken);
        store.rezervations = rezervationsRes;

        if (this.email == "admin@admin.com") {
          store.isadmin = true;
        } else {
          store.isadmin = false;
        }

        router.push("books");
      } catch (error) {
        store.error = error.message;
      }
    },
  },
};
</script>
