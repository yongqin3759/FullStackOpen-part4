const _ = require('lodash');

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs)=>{
  let totalLikes = 0
  for(let blog of blogs){
    let {likes} = blog
    totalLikes += likes
  }

  return totalLikes
}

const favoriteBlog = (blogs)=>{
  let favorite = null
  let maxLikes = -Infinity

  for(let blog of blogs){
    let {likes} = blog
    if(likes >= maxLikes){
      favorite = blog
      maxLikes = likes
    }
  }
  return favorite
}

const mostBlogs = (blogs)=>{
  let blogger = {}

  blogger = _.countBy(blogs, (blog)=>{return blog.author})

  let maxAuthor
  let maxCount = -1
  for(let author of Object.keys(blogger)){
    if(blogger[author] > maxCount){
      maxAuthor = author
      maxCount = blogger[author]
    }
  }
  return maxAuthor == null ? null : {
    author: maxAuthor,
    blogs: maxCount
  }
}


const mostLikes = (blogs)=>{
  let bloggerLikes = {}

  for(let blog of blogs){
    let{author,likes} = blog
    if(bloggerLikes[author]){
      bloggerLikes[author] += likes
    }else{
      bloggerLikes[author] = likes
    }
  }

  let maxAuthor = null
  let maxLikes = -1
  for(let author of Object.keys(bloggerLikes)){
    if(bloggerLikes[author] > maxLikes){
      maxAuthor = author
      maxLikes = bloggerLikes[author]
    }
  }
  return maxAuthor == null ? null : {
    author: maxAuthor,
    likes: maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}