import Vue from "vue";
import VueRouter from "vue-router";

import Home from "../views/Home";
import Books from "../views/Books";
import Rezervations from "../views/Rezervations";
import Login from "../views/Login";
import Register from "../views/Register";
import Book from "../views/Book";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/books",
    name: "Books",
    component: Books,
  },
  {
    path: "/rezervations",
    name: "Rezervations",
    component: Rezervations,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/book/:id",
    name: "Book",
    component: Book,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
