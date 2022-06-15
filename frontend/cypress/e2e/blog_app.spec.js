describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
      username: 'yongqin',
      password: 'qin',
      name: 'yong qin'
    }

    const anotherUser = {
      username: 'herp',
      password: 'derp',
      name: 'herpderp'
    }

    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.request('POST', 'http://localhost:3003/api/users', anotherUser)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('username')
    cy.contains('password')
    cy.contains('Login')
  })

  describe('Login', function(){
    it('succeeds with correct credentials', function(){
      cy.get('#username').type('yongqin')
      cy.get('#password').type('qin')
      cy.contains('login').click()

      cy.get('.success').should('contain', 'yong qin has logged in')
        .and('have.css', 'color', 'rgb(0, 128, 0)' )
        .and('have.css', 'border-style', 'solid' )
    })

    it('fails with incorrect credentials', function(){
      cy.get('#username').type('derp')
      cy.get('#password').type('herp')
      cy.contains('login').click()

      cy.get('.error').should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)' )
        .and('have.css', 'border-style', 'solid' )
    })
  })

  describe('When logged in', function(){
    beforeEach(function(){
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'yongqin',
        password: 'qin',
      }).then(({ body }) => {
        localStorage.setItem('user', JSON.stringify(body))
        cy.visit('http://localhost:3000')
      })
    })

    it('A blog can be created', function(){
      cy.contains('new blog').click()
      cy.get('#title').type('hello')
      cy.get('#author').type('tiffany ang')
      cy.get('#url').type('www.baker.com')

      cy.contains('Create Blog').click()

      cy.contains('tiffany ang')
      cy.contains('view').click()
      cy.contains('www.baker.com')
      cy.contains('Likes')
    })

    describe('When a blog is created', function(){
      beforeEach(function(){
        cy.contains('new blog').click()
        cy.get('#title').type('hello')
        cy.get('#author').type('tiffany ang')
        cy.get('#url').type('www.baker.com')

        cy.contains('Create Blog').click()
        cy.contains('view').click()
      })

      it('a user can like a blog', function(){
        cy.contains('Like').click()
        cy.contains('Likes 1')
      })

      it('a user can remove a blog', function(){
        cy.contains('remove').click()
        cy.contains('Blog deleted')
        cy.get('html').should('not.contain', 'tiffany ang')
      })

      it('an unauthorised user cannot delete a blog', function(){
        cy.contains('Logout').click()

        cy.request('POST', 'http://localhost:3003/api/login', {
          username: 'herp',
          password: 'derp',
        }).then(({ body }) => {
          localStorage.setItem('user', JSON.stringify(body))
          cy.visit('http://localhost:3000')
        })

        cy.contains('view').click()
        cy.contains('remove').click()

        cy.get('html').should('contain', 'tiffany ang')
        cy.get('.error').should('contain', 'Unauthorized')
          .and('have.css', 'color', 'rgb(255, 0, 0)' )
          .and('have.css', 'border-style', 'solid' )
      })

      it('blogs are in order of likes', function(){
        cy.contains('remove').click()
        cy.contains('Blog deleted')
        cy.get('html').should('not.contain', 'tiffany ang')

        cy.contains('new blog').click()
        cy.get('#title').type('blog with most likes')
        cy.get('#author').type('yq')
        cy.get('#url').type('www.mostlikes.com')
        cy.contains('Create Blog').click()

        cy.contains('new blog').click()
        cy.get('#title').type('blog with least likes')
        cy.get('#author').type('yq')
        cy.get('#url').type('www.leastlikes.com')
        cy.contains('Create Blog').click()

        cy.contains('blog with least likes').contains('view').click()
        cy.contains('Like').click().click()
        cy.contains('Like').click()

        cy.get('.blog').eq(0).contains('blog with least likes').click()
        cy.contains('hide').click()

        cy.contains('blog with most likes').contains('view').click()
        cy.contains('Like').click().click().click().click()
        cy.get('.blog').eq(0).contains('blog with most likes')
      })
    })
  })
})