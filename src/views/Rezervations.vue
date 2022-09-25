<template>
  <div>
    <div v-if="store.rezervations.length == 0">
      <h1>No rezevations</h1>
    </div>
    <div v-if="store.rezervations.length > 0">
      <h1>
        Moje rezervacije
      </h1>
      <div style="padding-bottom: 25px">
        <form class="d-flex">
          <input
            v-model="searchTerm"
            class="form-control me-2"
            type="search"
            placeholder="Pretraga"
            aria-label="Search"
          />
          <button
            class="btn btn-outline-success me-2"
            type="button"
            @click="searchButtonClicked()"
          >
            Pretraga
          </button>
        </form>
      </div>
      <Alert :error="store.error" :dismisClicked="dismis" />
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Book</th>
            <th scope="col">ISBN</th>
            <th scope="col">Start date</th>
            <th scope="col">End date</th>
            <th scope="col">Status</th>
            <th v-if="store.isadmin" scope="col">User</th>
            <th scope="col">Cancel</th>
            <th v-if="store.isadmin" scope="col">Ship</th>
            <th v-if="store.isadmin" scope="col">Complete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rez in filteredRezervations" :key="rez.id">
            <!-- <th scope="row">{{ rez.id.substring(0, 6) }}</th> -->
            <th scope="row">{{ rez.id }}</th>
            <td>{{ getBookName(rez.unnum) }}</td>
            <td>{{ rez.unnum }}</td>
            <td>{{ formatDate(rez.startdate) }}</td>
            <td>{{ formatDate(rez.enddate) }}</td>
            <td>{{ rez.status }}</td>
            <td v-if="store.isadmin">{{ getUserById(rez.userId).email }}</td>
            <td>
              <div
                v-if="rez.status == 'created'"
                class="btn btn-danger fa fa-trash"
                @click="cancelRezervation(rez)"
              />
            </td>
            <td>
              <div
                v-if="rez.status == 'created' && store.isadmin == true"
                class="btn btn-warning fa fa-pencil"
                @click="shipRezervation(rez)"
              />
            </td>
            <td>
              <div
                v-if="rez.status == 'shipped' && store.isadmin == true"
                class="btn btn-success fa fa-check"
                @click="completeRezervation(rez)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import Alert from "../components/Alert.vue";
import store from "../store";
import { editFbObject } from "../firebase";
import {
  getBookNameByISBN,
  getUserById,
} from "../helperFunction";

export default {
  name: "Rezervations",
  data() {
    return {
      searchTerm: "",
      store,
      filteredRezervations: store.isadmin
        ? store.rezervations
        : store.rezervations.filter((rez) => rez.userId == store.userId),
    };
  },
  computed: {},
  components: { Alert },
  methods: {
    async cancelRezervation(rez) {
      try {
        const updatedRezervation = {
          startdate: rez.startdate,
          enddate: new Date().toString(),
          status: 'canceled',
          unnum: rez.unnum,
          userId: rez.userId
        }
        const editRezResult = await editFbObject('rezervations', updatedRezervation, rez.id, store.token )
        if (editRezResult.status == 200) {
          store.rezervations.forEach(rezervation => {
            if(rezervation.id == rez.id){
              rezervation.status = updatedRezervation.status;
              rezervation.enddate = updatedRezervation.enddate;
            }
          });
        } else {
          store.error = "Rezervation not canceled!";
        }
      } catch (error) {
        store.error = error.message;
      }
    },
    async shipRezervation(rez) {
      try {
        const updatedRezervation = {
          startdate: rez.startdate,
          status: 'shipped',
          unnum: rez.unnum,
          userId: rez.userId
        }
        const editRezResult = await editFbObject('rezervations', updatedRezervation, rez.id, store.token)
        if (editRezResult.status == 200) {
          store.rezervations.forEach(rezervation => {
            if (rezervation.id == rez.id) {
              rezervation.status = updatedRezervation.status;
            }
          });
        } else {
          store.error = "Rezervation not canceled!";
        }
      } catch (error) {
        store.error = error.message;
      }
    },
    async completeRezervation(rez) {

      try {
        const updatedRezervation = {
          startdate: rez.startdate,
          enddate: new Date().toString(),
          status: 'finished',
          unnum: rez.unnum,
          userId: rez.userId
        }
        const editRezResult = await editFbObject('rezervations', updatedRezervation, rez.id, store.token)
        if (editRezResult.status == 200) {
          store.rezervations.forEach(rezervation => {
            if (rezervation.id == rez.id) {
              rezervation.status = updatedRezervation.status;
              rezervation.enddate = updatedRezervation.enddate;
            }
          });
        } else {
          store.error = "Rezervation not canceled!";
        }
      } catch (error) {
        store.error = error.message;
      }
    },
    dismis() {
      store.error = "";
    },
    getUserById(id) {
      return getUserById(id);
    },
    formatDate(date) {
      var mydate = new Date(date);
      if (date == null) {
        return "-";
      }
      return mydate.toLocaleDateString();
    },
    getRezervationStatus(id) {
      return getRezervationStatus(id);
    },
    getBookName(unnum) {
      let books = store.books.filter((book) => book.unnum == unnum);
      console.log(books);
      return books[0].title;
    },
    searchButtonClicked() {
      if (this.searchTerm != "") {
        let filtered = [];
        store.rezervations.forEach((rez) => {
          if (
            getBookNameByISBN(rez.unnum)
              .toLowerCase()
              .includes(this.searchTerm)
          ) {
            filtered.push(rez);
          }
        });
        this.filteredRezervations = filtered;
        return;
      }
      this.filteredRezervations = store.rezervations;
    },
  },
};
</script>
