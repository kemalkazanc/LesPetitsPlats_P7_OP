import Search from "./factory/Search.js";

//Recuperation des données
async function init() {
  const recipes = await getRecipesData();
  new Search(recipes);
}

init();
