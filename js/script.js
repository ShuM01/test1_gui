import { initSearch } from "./search.js";
import { fetchMovieDetails } from "./details.js";

const searchInput = document.getElementById("search-input");
const resultList = document.getElementById("result-list");
const template = document.getElementById("result-template");
const searchWrap = document.querySelector(".search-wrap");
const statusBar = document.getElementById("status-bar");

initSearch(searchInput, resultList, template, statusBar);
