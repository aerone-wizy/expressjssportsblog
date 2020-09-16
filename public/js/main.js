const deleteCategory = document.getElementsByClassName('delete-category')

for (i = 0; i < deleteCategory.length; i++) {
    deleteCategory[i].addEventListener("click", (event) => {
        var targetId = event.target.getAttribute('data-cat-id')
               
        fetch(`/categories/delete/${targetId}`, {
            method: 'DELETE'
        })
        .then(res => {
            window.location.href='/manage/categories'
        })
        .catch(err => console.log('err', err))
    });
}

const deleteArticle = document.getElementsByClassName('delete-article')

for (i = 0; i < deleteArticle.length; i++) {
    deleteArticle[i].addEventListener("click", (event) => {
        var targetId = event.target.getAttribute('data-article-id')
       
        console.log(targetId)
        fetch(`/articles/delete/${targetId}`, {
            method: 'DELETE'
        })
        .then(res => {
            window.location.href='/manage/articles'
        })
        .catch(err => console.log('err', err))
    });
}