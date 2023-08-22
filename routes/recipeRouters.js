const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const { RecipeModel } = require("../model/recipeModel");


const recipeRouter = express.Router();
recipeRouter.get("/", async (req, res) => {
    try {
        let recipes = await RecipeModel.find();
        res.status(200).json({ recipes, issue: false });
    } catch (error) {
        res.status(200).json({ "error": error.message, issue: true })

    }
})

recipeRouter.get("/profile", auth, async (req, res) => {
    const { userId } = req.headers.auth;
    try {
        let recipes = await RecipeModel.find({ _id: userId });
        res.status(200).json({ recipes, issue: false });
    } catch (error) {
        res.status(200).json({ "error": error.message, issue: true })

    }
})

recipeRouter.post("/add", auth, async (req, res) => {

    const { userId, username, mealName, ingredients, description, timing, mealType, category } = req.body;

    if (!userId || !username || !mealName || !ingredients || !description || !timing || !mealType || !category) {
        res.status(200).json({ "error": "all the fields are requried", issue: true });

    } else {
        try {
            let recipe = new RecipeModel(req.body);
            await recipe.save();
            res.status(200).json({
                "message": "recipe added", "recipeDetails": req.body,
                issue: false
            });
        } catch (error) {
            res.status(200).json({ "error": error.message, issue: true })
        }

    }

})


recipeRouter.patch("/update/:recipeId", auth, async (req, res) => {
    const { recipeId } = req.params;

    try {
        let recipe = await RecipeModel.findOne({ _id: recipeId });
        if (recipe.userId === req.body.userId) {
            await RecipeModel.updateOne({ _id: recipeId }, req.body);
            res.status(200).json({ "message": "recipe has been updated", issue: false });
        } else {
            res.status(200).json({ "error": "you are not authorized to update this recipe", issue: true })
        }


    } catch (error) {
        res.status(200).json({ "error": error.message, issue: true })
    }
})

recipeRouter.delete("/delete/:recipeId", auth, async (req, res) => {
    const { recipeId } = req.params;
    try {
        let recipe = await RecipeModel.findOne({ _id: recipeId });
        if (recipe.userId === req.body.userId) {
            await RecipeModel.deleteOne({ _id: recipeId });
            res.status(200).json({ "message": "recipe has been deleted", issue: false });
        } else {
            res.status(200).json({ "error": "you are not authorized to delete this recipe", issue: true })
        }

    } catch (error) {
        res.status(200).json({ "error": error.message, issue: true })
    }
})


module.exports = {
    recipeRouter
}