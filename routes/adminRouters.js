const express = require("express");
const { RecipeModel } = require("../model/recipeModel");
const { admin } = require("../middleware/admin.middelware");
const { UserModel } = require("../model/userModel");
const bcrypt = require("bcrypt");

const adminRouter = express.Router();
adminRouter.get("/recipes", admin, async (req, res) => {
    try {
        let recipes = await RecipeModel.find();
        res.status(200).json({ recipes, issue: false });
    } catch (error) {
        res.status(200).json({ "error": error.message, issue: true })

    }
})

adminRouter.get("/recipes/profile", admin, async (req, res) => {
    const { userId } = req.headers.auth;
    try {
        let recipes = await RecipeModel.find({ _id: userId });
        res.status(200).json({ recipes, issue: false });
    } catch (error) {
        res.status(200).json({ "error": error.message, issue: true })

    }
})

adminRouter.post("/recipes/add", admin, async (req, res) => {

    // recipeName: String,
    // username: String,
    // email: String,
    // comments: [{
    //     username: String,
    //     review: String
    // }],
    // difficulty: String,
    // prepTime: String,
    // cookTime: String,
    // totalTime: String,
    // servings: Number,
    // cuisine: String,
    // mealType: String,
    // occasion: String,
    // dietaryConsiderations: [String],
    // recipeType: String,
    // ingredients: [String],
    // instructions: [String],
    // notes: [
    //     String
    // ],
    // equipment: [
    //     String
    // ],
    // imageURL: String,
    // nutrition: Object,
    // tags: [String]

    const { email, username, recipeName, difficulty, prepTime, cookTime, totalTime, servings, cuisine, ingredients, mealType, occasion, recipeType, instructions, imageURL, tags } = req.body;

    if (!email || !username || !recipeName || !difficulty || !prepTime || !cookTime || !totalTime || !servings || !cuisine || !ingredients || !occasion || !mealType || !recipeType || !instructions || !imageURL || !tags) {
        res.status(200).json({ "error": "all the fields are requried", issue: true });

    } else {
        try {
            const recipe = new RecipeModel(req.body);
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


adminRouter.patch("/recipes/update/:recipeId", admin, async (req, res) => {
    const { recipeId } = req.params;

    try {

        await RecipeModel.updateOne({ _id: recipeId }, req.body);
        res.status(200).json({ "message": "recipe has been updated", issue: false });



    } catch (error) {
        res.status(200).json({ "error": error.message, issue: true })
    }
})

adminRouter.delete("/recipes/delete/:recipeId", admin, async (req, res) => {
    const { recipeId } = req.params;
    try {

        await RecipeModel.deleteOne({ _id: recipeId });
        res.status(200).json({ "message": "recipe has been deleted", issue: false });


    } catch (error) {
        res.status(200).json({ "error": error.message, issue: true })
    }
})



adminRouter.get("/users", admin, async (req, res) => {
    try {
        let users = await UserModel.find();
        res.status(200).json({ users, issue: false });
    } catch (error) {
        res.status(200).json({ "error": error.message, issue: true })
    }
})

adminRouter.post("/users/profile", admin, async (req, res) => {
    const email = req.body.email;
    try {
        let users = await UserModel.findOne({email});
        res.status(200).json({ users, issue: false });
    } catch (error) {
        res.status(200).json({ "error": error.message, issue: true })
    }
})


adminRouter.post("/users/add", admin, async (req, res) => {

    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(200).json({ "error": "all the fields are requried", issue: true });
    } else {
        try {
            let user = await UserModel.findOne({ email: email });

            if (user) {
                res.status(200).json({ "error": "User has already registered", issue: true })
            } else {
                
                bcrypt.hash(password, 5, async (err, hash) => {
                    if (err) return err;
                    req.body.password = hash;
                
                    const newbody = {
                        ...req.body,
                        followers: [],
                        following: []
                    }

                    let newuser = new UserModel(newbody);
                    await newuser.save();
                    res.status(200).json({ "message": "The new user has been registered", "registeredUser": req.body, issue: false });
                })

            }
        } catch (error) {
            res.status(200).json({ "error": error.message, issue: true })
        }
    }
})



adminRouter.patch("/users/update/:userId", admin, async (req, res) => {
    const { userId } = req.params;
    try {
        await UserModel.updateOne({ _id: userId }, req.body);
        res.status(200).json({ "message": "User updated.", issue: false });
    } catch (error) {
        res.status(200).json({ "error": error.message, issue: true })
    }
})



adminRouter.delete("/users/delete/:userId", admin, async (req, res) => {
    const { userId } = req.params;
    try {
        await UserModel.deleteOne({ _id: userId });
        res.status(200).json({ "message": "User Deleted.", issue: false });
    } catch (error) {
        res.status(200).json({ "error": error.message, issue: true })
    }
})

module.exports = {
    adminRouter
}