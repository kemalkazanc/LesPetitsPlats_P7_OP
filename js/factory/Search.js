/// Import ///
import RecipeCard from "./RecipeCard.js";

/// Class ///
export default class Search {
  constructor(data) {
    // console.log('search', data);

    /// DOM ///
    this.mainSearchBarFilter = document.getElementsByClassName(
      "main__searchbar--input"
    )[0]; // Bar de recherche
    this.mainSearchBarFilterBtn = document.getElementsByClassName(
      "main__searchbar--icon"
    )[0]; // Icon loupe

    this.recipeNotfoundMsg = document.getElementsByClassName(
      "search__message"
    )[0]; //Message d'erreur

    this.advanceSearchBarFilters = document.querySelectorAll(
      ".filter__header--input"
    ); // Bar de recherche ingredients

    this.filterIngredients = document.getElementById("filterIngredients"); //Id btn Ingrédient
    this.filterAppliances = document.getElementById("filterAppliances"); //Id btn Appareils
    this.filterUstensils = document.getElementById("filterUstensils"); //Id btn Ustenciles
    this.displayFilterMenuBtns = document.querySelectorAll(
      ".filter__header--chevronDown"
    ); //Icon chevronDown
    this.hideFilterMenuBtns = document.querySelectorAll(
      ".filter__header--chevronUp"
    ); //Icon chevronUp

    this.tagFilterParking = document.getElementsByClassName("tag__parking")[0]; //Section de séparation
    this.ingredientsFilterList = document.getElementsByClassName(
      "tag__filter--list"
    )[0]; //Container des listes items ingrédients
    this.appliancesFilterList = document.getElementsByClassName(
      "tag__filter--list"
    )[1]; //Container des listes items appareils
    this.ustensilsFilterList = document.getElementsByClassName(
      "tag__filter--list"
    )[2]; //Container des listes items ustenciles

    this.searchMessage = document.getElementsByClassName("search__message")[0]; //Section message d'erreur

    this.cardSection = document.getElementsByClassName("recipes__section")[0]; //Section des articles

    //---------- Data --------------//
    this.arrayAllRecipes = data; // tableau de toutes les recettes
    this.arrayRecipes = [];
    this.arrayActiveFilters = [];
    this.arrayIngredients = [];
    this.arrayAllIngredients = [];
    this.arrayAppliances = [];
    this.arrayAllAppliances = [];
    this.arrayUstensils = [];
    this.arrayAllUstensils = [];
    this.arrayFilteredRecipes = [];
    this.mainSearchInput = [];
    this.arrayMainSearchInputs = [];
    this.historyArrayActiveFilters = [];
    this.historySearch = "";

    //---------- Function ----------- ///
    /// Afficher toutes les recettes lors du chargement de la page ///
    this._initDisplay();

    /// Searchbar ///
    this.processChangeMain = this._debounce(() => this._mainSearch());
    this.processChangeAdvance = this._debounce(() => this._advanceSearch());

    /// Listener ///
    this.bindEvent();
  }

  /// C'est ici qu'on définit toute les interactions avec le Dom ///
  bindEvent() {
    if (this.mainSearchBarFilter !== 0) {
      this.mainSearchBarFilter.addEventListener(
        "keyup",
        this.processChangeMain
      );
    }

    if (this.advanceSearchBarFilters.length > 0) {
      for (let advanceSearchBarFilter of this.advanceSearchBarFilters) {
        advanceSearchBarFilter.addEventListener(
          "keyup",
          this.processChangeAdvance
        );
      }
    }

    /// Afficher les dropdown ///
    if (this.displayFilterMenuBtns.length > 0) {
      for (let displayFilterMenuBtn of this.displayFilterMenuBtns) {
        displayFilterMenuBtn.addEventListener("click", (e) => {
          let displayMenuBtn = e.target.parentElement.id;
          if (displayMenuBtn === "displayIndgredientsBtn") {
            this._switchListFilter("ingredients", "display");
          } else if (displayMenuBtn === "displayAppliancesBtn") {
            this._switchListFilter("appliances", "display");
          } else if (displayMenuBtn === "displayUstensilsBtn") {
            this._switchListFilter("ustensils", "display");
          }
        });
      }
    }

    /// Cacher les dropdown ///
    if (this.hideFilterMenuBtns.length > 0) {
      for (let hideFilterMenuBtn of this.hideFilterMenuBtns) {
        hideFilterMenuBtn.addEventListener("click", (e) => {
          let hideFilterMenuBtn = e.target.parentElement.id;
          if (hideFilterMenuBtn === "hideIngredientsBtn") {
            this._switchListFilter("ingredients", "hide");
          } else if (hideFilterMenuBtn === "hideAppliancesBtn") {
            this._switchListFilter("appliances", "hide");
          } else if (hideFilterMenuBtn === "hideUstensilsBtn") {
            this._switchListFilter("ustensils", "hide");
          }
        });
      }
    }
  }

  /// Afficher toute les recettes ///
  _initDisplay() {
    this.arrayRecipes = this.arrayAllRecipes;
    this.arrayFilteredRecipes = this.arrayAllRecipes;
    this._displayRecipeCard();
    this._setIngredientsFilterList();
    this._setAppliancesFilterList();
    this._setUstensilsFilterList();
  }

  /// Afficher toute les card ///
  _displayRecipeCard() {
    let recipeCard = "";
    for (let recipe of this.arrayFilteredRecipes) {
      recipeCard += new RecipeCard(recipe).recipeCardContent;
    }
    this.cardSection.innerHTML = recipeCard;
  }

  /// Fonction qui permet de mettre la 1er lettre en majuscule ///
  _setUpperCaseFirstChar(string) {
    return string && string[0].toUpperCase() + string.slice(1);
  }

  _setIngredientsFilterList() {
    this.arrayAllIngredients = [];
    for (let i = 0; i < this.arrayFilteredRecipes.length; i++) {
      for (
        let x = 0;
        x < this.arrayFilteredRecipes[i].ingredients.length;
        x++
      ) {
        let ingredient = this.arrayFilteredRecipes[i].ingredients[x].ingredient;
        this.arrayAllIngredients.push(ingredient.toLowerCase());
      }
    }
    this.arrayIngredients = new Set(this.arrayAllIngredients.sort());
  }

  _setAppliancesFilterList() {
    this.arrayAllAppliances = [];
    for (let i = 0; i < this.arrayFilteredRecipes.length; i++) {
      let appliance = this.arrayFilteredRecipes[i].appliance;
      this.arrayAllAppliances.push(appliance.toLowerCase());
    }
    this.arrayAppliances = new Set(this.arrayAllAppliances.sort());
  }

  _setUstensilsFilterList() {
    this.arrayAllUstensils = [];
    for (let i = 0; i < this.arrayFilteredRecipes.length; i++) {
      for (let x = 0; x < this.arrayFilteredRecipes[i].ustensils.length; x++) {
        let ustensil = this.arrayFilteredRecipes[i].ustensils[x];
        this.arrayAllUstensils.push(ustensil.toLowerCase());
      }
    }
    this.arrayUstensils = new Set(this.arrayAllUstensils.sort());
  }

  /// Afficher ou Masquer le dropdown ///
  _switchListFilter(filter, task) {
    switch (filter) {
      case "ingredients":
        if (task === "display") {
          this.filterIngredients.classList.add("active", "width-large");
          this.filterIngredients.classList.remove("width-small");
          this.filterAppliances.classList.remove("active");
          this.filterAppliances.classList.add("width-small");
          this.filterUstensils.classList.remove("active");
          this.filterUstensils.classList.add("width-small");
          this.advanceSearchBarFilters[1].value = "";
          this.advanceSearchBarFilters[2].value = "";
          this._displayFilterList(this.arrayIngredients);
        } else if (task === "hide") {
          this.filterIngredients.classList.remove("active", "width-large");
          this.filterIngredients.classList.add("width-small");
          this.advanceSearchBarFilters[0].value = "";
        }
        break;
      case "appliances":
        if (task === "display") {
          this.filterAppliances.classList.add("active", "width-large");
          this.filterAppliances.classList.remove("width-small");
          this.filterIngredients.classList.remove("active");
          this.filterIngredients.classList.add("width-small");
          this.filterUstensils.classList.remove("active");
          this.filterUstensils.classList.add("width-small");
          this.advanceSearchBarFilters[0].value = "";
          this.advanceSearchBarFilters[2].value = "";
          this._displayFilterList(this.arrayAppliances);
        } else if (task === "hide") {
          this.filterAppliances.classList.remove("active", "width-large");
          this.filterAppliances.classList.add("width-small");
          this.advanceSearchBarFilters[1].value = "";
        }
        break;
      case "ustensils":
        if (task === "display") {
          this.filterUstensils.classList.add("active", "width-large");
          this.filterUstensils.classList.remove("width-small");
          this.filterIngredients.classList.remove("active");
          this.filterIngredients.classList.add("width-small");
          this.filterAppliances.classList.remove("active");
          this.filterAppliances.classList.add("width-small");
          this.advanceSearchBarFilters[0].value = "";
          this.advanceSearchBarFilters[1].value = "";
          this._displayFilterList(this.arrayUstensils);
        } else if (task === "hide") {
          this.filterUstensils.classList.remove("active", "width-large");
          this.filterUstensils.classList.add("width-small");
          this.advanceSearchBarFilters[2].value = "";
        }
        break;
    }
  }

  /// Afficher le contenu du Dropdown ///
  _displayFilterList(data) {
    if (data === this.arrayIngredients) {
      this.ingredientsFilterList.innerHTML = "";
      for (let ingredient of data) {
        this.ingredientFilterListItem = document.createElement("li");
        this.ingredientFilterListItem.classList.add(
          "itemFilter",
          "ingredientFilter"
        );
        this.ingredientFilterListItem.setAttribute(
          "data-filtertype",
          "filterIngredient"
        );
        this.ingredientFilterListItem.textContent = this._setUpperCaseFirstChar(
          ingredient
        );
        this.ingredientsFilterList.appendChild(this.ingredientFilterListItem);
        this._removeDropdownFilter("ingredients");
        this.ingredientFilterListItem.addEventListener("click", (e) => {
          this._switchListFilter("ingredients", "hide");
          this._displaySelectedFilter(e);
        });
      }
    } else if (data === this.arrayAppliances) {
      this.appliancesFilterList.innerHTML = "";
      for (let appliance of data) {
        this.applianceFilterListitem = document.createElement("li");
        this.applianceFilterListitem.classList.add(
          "itemFilter",
          "applianceFilter"
        );
        this.applianceFilterListitem.setAttribute(
          "data-filtertype",
          "filterAppliance"
        );
        this.applianceFilterListitem.textContent = this._setUpperCaseFirstChar(
          appliance
        );
        this.appliancesFilterList.appendChild(this.applianceFilterListitem);
        this._removeDropdownFilter("appliances");
        this.applianceFilterListitem.addEventListener("click", (e) => {
          this._switchListFilter("appliances", "hide");
          this._displaySelectedFilter(e);
        });
      }
    } else if (data === this.arrayUstensils) {
      this.ustensilsFilterList.innerHTML = "";
      for (let ustensil of data) {
        this.ustensilFilterListItem = document.createElement("li");
        this.ustensilFilterListItem.classList.add(
          "itemFilter",
          "ustensilFilter"
        );
        this.ustensilFilterListItem.setAttribute(
          "data-filtertype",
          "filterUstensil"
        );
        this.ustensilFilterListItem.textContent = this._setUpperCaseFirstChar(
          ustensil
        );
        this.ustensilsFilterList.appendChild(this.ustensilFilterListItem);
        this._removeDropdownFilter("ustensils");
        this.ustensilFilterListItem.addEventListener("click", (e) => {
          this._switchListFilter("ustensils", "hide");
          this._displaySelectedFilter(e);
        });
      }
    }
  }

  // Affichage des Tags
  // Afficher les Tags selectionner //
  _displaySelectedFilter(e) {
    this.filterName = e.target.textContent;
    this.filterType = e.target.dataset.filtertype;
    this.selectedTagContainer = document.createElement("div");
    this.selectedFilterContent = `
            <span class="selectedFilter">${this.filterName}</span>
            <span class="fa-regular fa-circle-xmark circleCrossBtn"></span>
        `;
    this.selectedTagContainer.innerHTML = this.selectedFilterContent;
    this.selectedTagContainer.classList.add(
      "tag__parking--items",
      "display-flex"
    );
    this.selectedTagContainer.setAttribute(
      "data-filtertype",
      `${this.filterType}`
    );

    if (this.filterType === "filterIngredient") {
      this.selectedTagContainer.classList.add("filter__bckground--blue");
    } else if (this.filterType === "filterAppliance") {
      this.selectedTagContainer.classList.add("filter__bckground--green");
    } else if (this.filterType === "filterUstensil") {
      this.selectedTagContainer.classList.add("filter__bckground--red");
    }
    this.tagFilterParking.appendChild(this.selectedTagContainer);

    this.selectedFilterCloseBtns = document.querySelectorAll(".circleCrossBtn");
    for (this.filterCloseBtn of this.selectedFilterCloseBtns) {
      this.filterCloseBtn.addEventListener("click", (e) => {
        this._switchListFilter("ingredients", "hide");
        this._switchListFilter("appliances", "hide");
        this._switchListFilter("ustensils", "hide");
        this._deleteSelectedFilter(e);
      });
    }
    this.arrayActiveFilters.push(this.filterName.toLowerCase());
    this._mainSearch();
  }

  // Suppression des Tags //
  _removeDropdownFilter(list) {
    for (let activFilter of this.arrayActiveFilters) {
      if (list === "ingredients") {
        if (
          activFilter ===
          this.ingredientFilterListItem.textContent.toLowerCase()
        ) {
          console.log("ingredients");
          this.ingredientFilterListItem.remove();
        }
      } else if (list === "appliances") {
        if (
          activFilter === this.applianceFilterListitem.textContent.toLowerCase()
        ) {
          console.log("appliances");
          this.applianceFilterListitem.remove();
        }
      } else if (list === "ustensils") {
        if (
          activFilter === this.ustensilFilterListItem.textContent.toLowerCase()
        ) {
          console.log("ustensils");
          this.ustensilFilterListItem.remove();
        }
      }
    }
  }

  /// Supprimer les Tags selectionner ///
  _deleteSelectedFilter(e) {
    this.selectedFilter = e.target.parentElement;
    this.selectedFilter.remove("display-flex");
    this.selectedfilterItem = e.target.previousElementSibling.textContent.toLowerCase();

    let i = this.arrayActiveFilters.length;
    while (i--) {
      if (this.arrayActiveFilters[i] === this.selectedfilterItem) {
        this.arrayActiveFilters.splice(i, 1);
      }
    }

    this._mainSearch();
  }

  // --------- Fonction des delais lors de la regarde ------------ //
  _debounce(func, timeout = 2000) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  /// Main searchbar ///
  _mainSearch() {
    this.arrayFilteredRecipes = [];
    this.mainSearchInput = this.mainSearchBarFilter.value.toLowerCase();

    if (this.mainSearchInput.length >= 3) {
      console.log("0 - launch test : si main search input > 3");

      if (
        this.historySearch.includes(this.mainSearchInput) ||
        this.arrayActiveFilters.includes(this.mainSearchInput)
      ) {
        console.log(
          "2 - launch test : si recherche principale > 3 && recherche principale présents dans historique recherche paincipale OU dans les filtres actifs"
        );

        this._filterRecipes();
      } else {
        console.log(
          "3 - launch test : si recherche principale > 3 MAIS absente de historique recherhce principale OU des filtres actifs (> supp ancienne saisie de la recherche principale des filtres actifs)"
        );

        this.arrayActiveFilters = this.arrayActiveFilters.filter(
          (filter) => filter != this.historySearch
        );

        this.historySearch = "";
        this.historySearch = this.mainSearchInput;
        this.arrayActiveFilters.push(this.mainSearchInput);

        this._filterRecipes();
      }
    } else if (this.mainSearchInput <= 0) {
      console.log("4 - launch test : si recherche principale vide");

      if (this.arrayActiveFilters.length > 0) {
        console.log(
          "5 - launch test : si recherche prinsipale vide MAIS filtre actifs présents"
        );

        if (this.historySearch.length > 0) {
          console.log(
            "6 - launch test : si recherche prinsipale vide MAIS filtre actifs présents && si il y a un historique de recherche principale"
          );

          this.arrayActiveFilters = this.arrayActiveFilters.filter(
            (filter) => filter != this.historySearch
          );

          this.historySearch = "";

          if (this.arrayActiveFilters.length > 0) {
            console.log(
              "6-1 launch test : si recherche prinsipale vide && si il y a un historique de recherche principale && toujours des filtres actifs après leurs filtrage avec historique de la recherche principale"
            );

            // this.historyArrayActiveFilters = this.arrayActiveFilters

            this._filterRecipes();
          } else {
            console.log(
              "6-2 launch test : si recherche prinsipale vide && si il y a un historique de recherche principale && plus de filtres actifs après leurs filtrage avec historique de la recherche principale"
            );

            // this.historyArrayActiveFilters = []
            this.recipeNotfoundMsg.classList.add("hidden");
            this._initDisplay();
          }
        } else {
          console.log(
            "7 - launch test : si recherche prinsipale vide MAIS filtre actifs présents && pas historique de recherche principale"
          );

          // this.historyArrayActiveFilters = this.arrayActiveFilters

          this._filterRecipes();
        }
      } else {
        console.log(
          "8 - launch test : si recherche prinsipale vide && aucun filtre actif"
        );

        // this.historyArrayActiveFilters = []
        this.recipeNotfoundMsg.classList.add("hidden");
        this._initDisplay();
      }
    }
  }

  /// Tag filter searchbar ///
  _advanceSearch() {
    for (let advanceSearchBarFilter of this.advanceSearchBarFilters) {
      if (advanceSearchBarFilter.dataset.filtertype === "ingredients") {
        let itemIngredientsFilterNodeList = document.querySelectorAll(
          ".ingredientFilter"
        );
        if (advanceSearchBarFilter.value.length > 0) {
          for (let ingredientFilter of itemIngredientsFilterNodeList) {
            if (
              ingredientFilter.innerHTML
                .toLowerCase()
                .includes(advanceSearchBarFilter.value)
            ) {
              ingredientFilter.classList.remove("hidden");
            } else {
              ingredientFilter.classList.add("hidden");
            }
          }
        } else {
          for (let ingredientFilter of itemIngredientsFilterNodeList) {
            ingredientFilter.classList.remove("hidden");
          }
        }
      } else if (advanceSearchBarFilter.dataset.filtertype === "appliances") {
        let itemAppliancesFilterNodeList = document.querySelectorAll(
          ".applianceFilter"
        );
        if (advanceSearchBarFilter.value.length > 0) {
          for (let applianceFilter of itemAppliancesFilterNodeList) {
            if (
              applianceFilter.innerHTML
                .toLowerCase()
                .includes(advanceSearchBarFilter.value)
            ) {
              applianceFilter.classList.remove("hidden");
            } else {
              applianceFilter.classList.add("hidden");
            }
          }
        } else {
          for (let applianceFilter of itemAppliancesFilterNodeList) {
            applianceFilter.classList.remove("hidden");
          }
        }
      } else if (advanceSearchBarFilter.dataset.filtertype === "ustensils") {
        let itemUstensilsFilterNodeList = document.querySelectorAll(
          ".ustensilFilter"
        );
        if (advanceSearchBarFilter.value.length > 0) {
          for (let ustensilFilter of itemUstensilsFilterNodeList) {
            if (
              ustensilFilter.innerHTML
                .toLowerCase()
                .includes(advanceSearchBarFilter.value)
            ) {
              ustensilFilter.classList.remove("hidden");
            } else {
              ustensilFilter.classList.add("hidden");
            }
          }
        } else {
          for (let ustensilFilter of itemUstensilsFilterNodeList) {
            ustensilFilter.classList.remove("hidden");
          }
        }
      }
    }
  }

  /// Recherche des filtre ///
  _filterRecipes() {
    console.log("XX - array activ filter", this.arrayActiveFilters);

    this.arrayRecipes = this.arrayAllRecipes;
    if (this.arrayActiveFilters.length > 0) {
      for (let filter of this.arrayActiveFilters) {
        this.arrayFilteredRecipes = [];
        // console.log('A3 - array recipes', this.arrayRecipes);
        for (let recipe of this.arrayRecipes) {
          let recipeUstensils = [];
          for (let ustensil of recipe.ustensils) {
            recipeUstensils.push(ustensil.toLowerCase());
          }
          if (
            recipe.name.toLowerCase().includes(filter) ||
            recipe.description.toLowerCase().includes(filter) ||
            recipe.ingredients.some((ingredients) =>
              ingredients.ingredient.toLowerCase().includes(filter)
            ) ||
            recipe.appliance.toLowerCase().includes(filter) ||
            recipeUstensils.includes(filter)
          ) {
            this.arrayFilteredRecipes.push(recipe);
          }
        }
        this.arrayRecipes = [];
        this.arrayRecipes = this.arrayFilteredRecipes;
      }
      if (this.arrayRecipes.length <= 0) {
        this.recipeNotfoundMsg.classList.remove("hidden");
      } else {
        this.recipeNotfoundMsg.classList.add("hidden");
      }
      this._displayRecipeCard();
      this._setIngredientsFilterList();
      this._setAppliancesFilterList();
      this._setUstensilsFilterList();
      console.log("XX - array recipes", this.arrayRecipes);
    } else {
      this.recipeNotfoundMsg.classList.add("hidden");
      this._initDisplay();
    }
  }
}
