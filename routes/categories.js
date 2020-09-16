const express = require('express');
const category = require('../models/category');
const router = express.Router();

const { body, validationResult } = require('express-validator');
const article = require('../models/article');

Category = require('../models/category')

// Categories - GET
router.get('/', (req, res, next) => {
    Category.getCategories((err, categories) => {
        if (err) res.send(err)

        res.render("categories", {
            title: 'Categories',
            categories: categories
        })
    })
})

//Add category - POST
router.post('/add', [
    body('title').notEmpty().withMessage("Title is required")
], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()){
        Category.getCategory(category, (err, category) => {
            res.render('add_category', {
                errors: errors.array(),
                title: "Create Category",
                category: category
            })
        })
        
    } else {
        let category = new Category()
        category.title = req.body.title
        category.description = req.body.description

        Category.addCategory(category, (err, category) => {
            if (err) res.send(err)

            res.redirect('/manage/categories')
        })
    }

    
})

//Edit category - POST
router.post('/edit/:id', [
    body('title').notEmpty().withMessage("Title is required")
], (req, res) => {
    
    const errors = validationResult(req);
    console.log(errors.array())

    if (!errors.isEmpty()){
        res.render('edit_category', {
            errors: errors.array(),
            title: "Edit Category"
        })
    } else {
        let category = new Category()
        const query = {_id: req.params.id}
        const update = {title: req.body.title, description: req.body.description}

        Category.updateCategory(query, update, {}, (err, category) => {
            if (err) res.send(err)

            // res.flash('success', 'Category Saved')
            res.redirect('/manage/categories')
        })
    }
})

//Delete Category
router.delete('/delete/:id', (req, res, next) => {
    const query = {_id: req.params.id}

    Category.removeCategory(query, (err, category) => {
        if (err) res.send(err)

        res.status(200)
    })
})

module.exports = router