const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');

const Article = require('../models/article');

router.get('/', (req, res, next) => {
    Article.getArticles((err, articles) => {
        res.render('articles', {
            title: "Articles",
            articles: articles
        })
    })
})

router.get('/show/:id', (req, res, next) => {
    Article.getArticleById(req.params.id, (err, article) => {
        res.render("article", {
            title: "Article",
            article: article
        })
    })
    
})

router.get('/category/:category_id', (req, res, next) => {
    Article.getCategoryArticles(req.params.category_id, (err, articles) => {
        Category.getCategoryById(req.params.category_id, (err, category) => {
            res.render('articles', {
                title: category.title+" Articles",
                articles: articles
            })
        })
    })
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

            req.flash('success', 'Article added')
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

            req.flash('success', 'Article Updated')
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

//
router.post('/comments/add/:id', [
    body('comment_subject').notEmpty().withMessage("Subject is required"),
    body('comment_author').notEmpty().withMessage("Author is required"),
    body('comment_body').notEmpty().withMessage("Body is required")
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        Article.getArticleById(req.params.id, (err, article) => {
            if (err) res.send(err)
    
            res.render('article', {
                errors: errors.array(),
                title: "Edit Article",
                article: article
            })
        })
    } else {
        let article = new Article()
        const query = {_id: req.params.id}
        const comment = {
            comment_subject: req.body.comment_subject,
            comment_author: req.body.comment_author,
            comment_body: req.body.comment_body,
            comment_email: req.body.comment_email
        }

        Article.addComment(query, comment, (err, article) => {
            if (err) res.send(err)

            // req.flash('success', 'Article Updated')
            res.redirect('/articles/show/'+req.params.id)
        })
    }
})

module.exports = router