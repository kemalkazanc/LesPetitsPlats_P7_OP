
// Fonction Fetch

async function getRecipesData() {
    const recipeData = await fetch("/data/recipes.json")
        .then(response => {
            if (response.ok) {
            return response.json()
            } else {
                console.log('Une erreur est survenue');
            }
        })
        .catch(err => console.log("error"))
    //console.log('recipeData', recipeData);       
    return recipeData    
};
