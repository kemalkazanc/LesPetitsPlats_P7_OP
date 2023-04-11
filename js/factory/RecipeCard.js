/// Class ///
export default class RecipeCard {
  constructor(data) {
    this.id = data.id; //recupère l'id de la recette
    this.name = data.name; //recupère le nom de la recette
    this.time = data.time; //recupère le temps de la recette
    this.ingredients = data.ingredients; //recupère les ingrédients de la recette
    this.description = data.description; //recupère la description de la recette
    this._createCard();
  }

  // Creation de la Card des Recettes
  _createCard() {
    this.recipeCardContent = `
        <article class="recipe__card" data-index="${this.id}">
            <div class="recipe__card--imgContainer">
            <img src="https://picsum.photos/200/300" alt="${
              this.name
            }" class="recipe__card--img">
            </div>
            <div class="recipe__card--description">
                <div class="recipe__card--header">
                    <h2 class="recipe__card--title">${this.name}</h2>
                    <div class="recipe__card--time">
                        <span class="recipe__card--timeIcon fa-regular fa-clock" aria-label="Icone temps de cuisson"></span>
                        <span class="recipe__card--cookingTime">${
                          this.time
                        } min</span>
                    </div>
                </div>
                <div class="recipe__card--explanation">
                    <p class="recipe__card--ingredients">
                        ${this._getIngredientRecipeCardDOM(
                          this.ingredients
                        ).join("")}
                    </p>
                    <p class="recipe__card--cookingDescription">${
                      this.description
                    }</p>
                </div>
            </div>
        </article>
        `;
  }

  _getIngredientRecipeCardDOM(data) {
    //console.log('dataFromGetIngREcipeDArdDom', data);
    let arrayIngredients = [];
    for (let i = 0; i < data.length; i++) {
      //console.log('data.length', data.length);
      let ingredients = data[i];
      //console.log('ingredientData(i)', ingredients);
      let ingredientSection = `
                <span class="bold">${
                  ingredients.ingredient ? ingredients.ingredient : ""
                } : </span> <span>${
        ingredients.quantity ? ingredients.quantity : ""
      }  ${ingredients.unit ? ingredients.unit : ""}</span>
                </br>
            `;
      arrayIngredients.push(ingredientSection);
    }
    //console.log('arrayIngredients', arrayIngredients);
    return arrayIngredients;
  }
}
