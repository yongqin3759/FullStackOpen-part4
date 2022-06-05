import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render,screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Test <Blog/> component', ()=> {
    let container
    let mockHandler
    beforeEach(()=> {
        const blog={
            title: 'some title',
            author: 'author',
            url: 'www.blog.com',
            likes: 3,
            user: {
                name: 'yq'
            }
        }
        mockHandler = jest.fn()
    
        container = render(<Blog blog={blog} updateLikes={mockHandler}/>).container
    })

    test('renders title and author', ()=> {
        const title = screen.findByText('some title')
        expect(title).toBeDefined()
        const author = screen.findByText('author')
        expect(author).toBeDefined()
    
        const url = container.querySelector('.additional-info')
        expect(url).toBeNull()
    })

    test('show url and likes', async ()=> {
        const user = userEvent.setup()

        const showInfo = container.querySelector('.toggle-blog-info')

        await user.click(showInfo)
        const url = container.querySelector('.blog-url')
        const likes = container.querySelector('.blog-likes')
        expect(url).not.toBeNull()
        expect(likes).not.toBeNull()
    })

    test('like button is clicked twice', async()=> {
        const user = userEvent.setup()

        const showInfo = container.querySelector('.toggle-blog-info')

        await user.click(showInfo)

        const likeButton = container.querySelector('.add-likes')

        await user.click(likeButton)
        await user.click(likeButton)

        expect(mockHandler.mock.calls).toHaveLength(2)
    })


})

