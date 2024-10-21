import bookPlaceholderSvg from 'assets/book-placeholder.svg'
import {queryCache, useQuery} from 'react-query'
import {client} from './api-client'
import {useCallback, useContext} from 'react'
import {AuthContext} from 'context/auth-context'
const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}
const loadingBooks = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

const getBookSearchConfig = (query, user) => ({
  queryKey: ['bookSearch', {query}],
  queryFn: () =>
    client(`books?query=${encodeURIComponent(query)}`, {
      token: user.token,
    }).then(data => data.books),
  config: {
    onSucess(books) {
      books.forEach(book => setQueryDataForBook(book))
    },
  },
})

function useBookSearch(query) {
  const {user} = useContext(AuthContext)

  const result = useQuery(getBookSearchConfig(query, user))
  console.log(result)
  return {...result, books: result.data ?? loadingBooks}
}

function useBook(bookId) {
  const {user} = useContext(AuthContext)
  const {data} = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () =>
      client(`books/${bookId}`, {
        token: user.token,
      }).then(data => data.book),
  })
  return data ?? loadingBook
}

function useRefetchBookSearchQuery() {
  const {user} = useContext(AuthContext)
  return useCallback(
    async function refetchBookSearchQuery() {
      queryCache.removeQueries('bookSearch')
      queryCache.prefetchQuery(getBookSearchConfig('', user))
    },
    [user],
  )
}
function refetchBookSearchQuery(user) {
  queryCache.removeQueries('bookSearch')
  queryCache.prefetchQuery(getBookSearchConfig('', user))
}

function setQueryDataForBook(book) {
  queryCache.setQueryData(['book', {bookId: book.id}], book)
}
export {
  refetchBookSearchQuery,
  setQueryDataForBook,
  useBook,
  useRefetchBookSearchQuery,
  useBookSearch,
}
