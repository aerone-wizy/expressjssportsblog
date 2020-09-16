const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');

const Article = require('../models/article');
const category = require('../models/category');

router.get('/', (req, res, next) => {
    res.render("articles", {title: "Articles"})
})

router.get('/show/:id', (req, res, next) => {
    res.render("article", {title: "Article"})
})

router.get('/category/:category_id', (req, res, next) => {
    res.render("article", {title: "Category Articles"})
})

//Add articles - POST
router.post('/add', [
    body('title').notEmpty().withMessage("Title is required"),
    body('author').notEmpty().withMessage("Author is required"),
    body('category').notEmpty().withMessage("Category is required"),
    body('body').notEmpty().withMessage("Body is required")
], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()){
        Category.getCategories((err, categories) => {
            res.render('add_article', {
                errors: errors.array(),
                title: "Create Article",
                categories: categories
            })
        })
        
    } else {
        let article = new Article()
        article.title = req.body.title
        article.subtitle = req.body.subtitle
        article.category = req.body.category
        article.body = req.body.body
        article.author = req.body.author
        
        Article.addArticle(article, (err, article) => {
            if (err) res.send(err)

            res.redirect('/manage/articles')
        })
    }
})

//Edit Article - POST
router.post('/edit/:id', [
    body('title').notEmpty().withMessage("Title is required"),
    body('author').notEmpty().withMessage("Author is required"),
    body('category').notEmpty().withMessage("Category is required"),
    body('body').notEmpty().withMessage("Body is required")
], (req, res, next) => {
    
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        Category.getCategories((err, categories) => {
            Article.getArticleById(req.params.id, (err, article) => {
                if (err) res.send(err)
        
                res.render('edit_article', {
                    errors: errors.array(),
                    title: "Edit Article",
                    categories: categories,
                    article: article
                })
                
            })
            
        })
    } else {
        let article = new Article()
        const query = {_id: req.params.id}
        const update = {
            title: req.body.title,
            subtitle: req.body.subtitle,
            category: req.body.category,
            body: req.body.body,
            author: req.body.author,
        }

        Article.updateArticle(query, update, {}, (err, article) => {
            if (err) res.send(err)

            res.redirect('/manage/articles')
        })
    }
    
    
})

//Delete Article
router.delete('/delete/:id', (req, res, next) => {
    const query = {_id: req.params.id}

    Article.removeArticle(query, (err, article) => {
        if (err) res.send(err)

        res.status(200)
    })
})

module.exports = router