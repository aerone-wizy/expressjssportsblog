const mongoose = require('mongoose')

const articleSchema = mongoose.Schema({
    title: {
        type: String
    },
    subtitle: {
        type: String
    },
    category: {
        type: String
    },
    body: {
        type: String
    },
    author: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    comments: [{
        comment_subject: {
            type: String
        },
        comment_body: {
            type: String
        },
        comment_author: {
            type: String
        },
        comment_email: {
            type: String
        },
        comment_date: {
            type: String
        }
    }]
})

const Article = module.exports = mongoose.model('Article', articleSchema)

//Get articles
module.exports.getArticles = (callback, limit) => {
    Article.find(callback).limit(limit).sort([['title', 'ascending']])
}

//Add article
module.exports.addArticle = (article, callback) => {
    Article.create(article, callback)
}

//Get Single Article by ID
module.exports.getArticleById = (id, callback) => {
    Article.findById(id, callback)
}

//Update article 
module.exports.updateArticle = (query, update, options, callback) => {
    Article.findOneAndUpdate(query, update, options, callback)
}

//Remove Article
module.exports.removeArticle = (query, callback) => {
    Article.remove(query, callback)
}