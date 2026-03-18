import { initSearch } from "./search.js";
import { fetchMovieDetails } from "./details.js";

const searchBox   = document.getElementById("searchBox");
const resultsList = document.getElementById("results");
const template    = document.getElementById("result-template");
const app         = document.getElementById("app");

// Connect search logic with details logic
initSearch(searchBox, resultsList, template, app, fetchMovieDetails);
