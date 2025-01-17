const db = require("../db-connection");

const getRandomRecipesForWeek = () => {
  const breakfastPromise = db.query(`
  SELECT *
  FROM recipes
  WHERE slot = 1
  LIMIT 7;
  `);
  const lunchPromise = db.query(`
  SELECT *
  FROM recipes
  WHERE slot = 2
  LIMIT 7;
  `);
  const dinnerPromise = db.query(`
  SELECT *
  FROM recipes
  WHERE slot = 3
  LIMIT 7;
  `);
  return Promise.all([breakfastPromise, lunchPromise, dinnerPromise])
    .then((results) => {
      const breakfastRecipes = results[0].rows;
      const lunchRecipes = results[1].rows;
      const dinnerRecipes = results[2].rows;
      return [breakfastRecipes, lunchRecipes, dinnerRecipes];
    })
    .catch((err) => {
      console.log("getRandomRecipesForWeek error: ", err.message);
    });
};

const getRandomRecipeForSlot = (slot, arrayOfRecipeIds) => {
  console.log("array of existing recipe ids: ", arrayOfRecipeIds);
  const arrayString = arrayOfRecipeIds.join(", ");
  console.log("query", `
  SELECT * FROM recipes
  WHERE api_recipe_id NOT IN (${arrayString}) AND slot = ${slot}
  ORDER BY RANDOM ()
  LIMIT 1;
  `);
  return db.query(`
  SELECT * FROM recipes
  WHERE api_recipe_id NOT IN (${arrayString}) AND slot = ${slot}
  ORDER BY RANDOM ()
  LIMIT 1;
  `)
    .then(res => {
      const recipe = res.rows[0];
      console.log(`random recipe for slot ${slot}`, recipe);
      return recipe;
    }).catch(err => {
      console.log("getRandomRecipeForSlot error: ", err.message);
    });

};

module.exports = { getRandomRecipesForWeek, getRandomRecipeForSlot };
