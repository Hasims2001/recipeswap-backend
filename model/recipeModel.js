
const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    userId: String,
    username: String,
    mealName: String,
    ingredients: [String],
    description: String,
    timing: String,
    mealType: String,
    category: String,
    image: String

})

const RecipeModel = mongoose.model("recipe", recipeSchema);

module.exports = {
    RecipeModel
}




