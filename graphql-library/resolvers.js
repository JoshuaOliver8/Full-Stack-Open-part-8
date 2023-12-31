const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')


const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            if (args.genre) {
                const books = Book.find({ genres: [args.genre] }).populate('author')
                return books
            }
    
            const books = await Book.find({}).populate('author')
            return books
        },
        allAuthors: async () => Author.find({}),
        me: (root, args, context) => {
            return context.currentUser
        }
    },
    Author: {
        bookCount: async (root) => {
            const books = await Book.find({}).populate('author')
            return books.filter(b => b.author.name === root.name).length
        }
    },
    Mutation: {
        addBook: async (root, args, context) => {
            let book
            const existingAuthor = await Author.findOne({ name: args.author })
            const currentUser = context.currentUser
    
            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                extensions: {
                    code: 'BAD_USER_INPUT',
                }
                })
            }
    
            if (!existingAuthor) {
                const author = new Author({ name: args.author })
    
                try {
                await author.save()
                book = new Book({ ...args, author: author })
                } catch (error) {
                throw new GraphQLError('Saving author failed', {
                    extensions: {
                    code: 'BAD_USER_INPUT',
                    invalidArgs: args.author,
                    error
                    }
                })
                }
            } else {
                book = new Book({ ...args, author: existingAuthor})
            }
    
            try {
                await book.save()
            } catch (error) {
                throw new GraphQLError('Saving book failed', {
                extensions: {
                    code: 'BAD_USER_INPUT',
                    invalidArgs: args.title,
                    error
                }
                })
            }

            pubsub.publish('BOOK_ADDED', { bookAdded: book })
    
            return book
        },
        editAuthor: async (root, args, context) => {
            const author = await Author.findOne({ name: args.name })
            const currentUser = context.currentUser
    
            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                extensions: {
                    code: 'BAD_USER_INPUT',
                }
                })
            }
    
            if (!author) {
                throw new GraphQLError('could not find author', {
                extensions: {
                    code: 'BAD_USER_INPUT',
                    invalidArgs: args.name
                }
                })
            }
    
            author.born = args.born
    
            try {
                await author.save()
            } catch (error) {
                throw new GraphQLError('Editing author failed', {
                extensions: {
                    code: 'BAD_USER_INPUT',
                    invalidArgs: args.name,
                    error
                }
                })
            }
            
            return author 
        },
        createUser: async (root, args) => {
            const genre = args.favoriteGenre
    
            if (genre.length < 4 ) {
            throw new GraphQLError('Genre too short', {
                extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.favoriteGenre
                }
            })
            }
    
            const user = new User({ username: args.username, favoriteGenre: genre })
    
            return user.save()
            .catch(error => {
                throw new GraphQLError('Creating user failed', {
                extensions: {
                    code: 'BAD_USER_INPUT',
                    invalidArgs: args.name,
                    error
                }
                })
            })
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })
    
            if ( !user || args.password !== 'secret') {
                throw new GraphQLError('wrong credentials', {
                    extensions: { code: 'BAD_USER_INPUT' }
                })
            }
    
            const userForToken = {
                username: user.username,
                id: user._id,
            }
    
            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
        }
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
        }
    }
}

module.exports = resolvers