import bookPlaceholderSvg from 'assets/book-placeholder.svg'
import { queryCache, useQuery } from 'react-query'
import { client } from './api-client'
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

const getBookSearchConfig =(query,user) => ({
    queryKey: ['bookSearch', {query}],
    queryFn: () =>
      client(`books?query=${encodeURIComponent(query)}`, {
        token: user.token,
      }).then(data => data.books),
})

function useBookSearch(query,user){
    console.log(query)
    const result = useQuery(getBookSearchConfig(query,user))
    console.log(result)
    return {...result, books: result.data ?? loadingBooks}
}
function useBook(bookId,user){
    const { data}= useQuery({
        queryKey: ['book', {bookId}],
        queryFn: () =>
          client(`books/${bookId}`, {
            token: user.token,
          }).then(data => data.book),
      })
      return data ?? loadingBook
}
function refetchBookSearchQuery(user){
    queryCache.removeQueries('bookSearch')
    queryCache.prefetchQuery(getBookSearchConfig('',user))
}
export { refetchBookSearchQuery, useBook, useBookSearch }

