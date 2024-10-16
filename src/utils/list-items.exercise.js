import {setQueryDataForBook} from './books.exercise'

const {
  useQuery,
  useMutation,
  queryCache,
} = require('react-query/dist/react-query.development')
const {client} = require('./api-client')

function useListItems(user) {
  const {data: listItem} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client('list-items', {token: user.token}).then(data => data.listItems),
    config: {
      onSucess(listItems) {
        listItems.forEach(book => setQueryDataForBook(book, user.token))
      },
    },
  })

  return listItem || []
}

const defaultMutationOptions = {
  onerror(err, variables, recover) {
    if (typeof recover === 'function') {
      recover()
    }
  },
  onSettled: () => queryCache.invalidateQueries('list-items'),
  throwOnError: true,
}
function useRemoveListItem(user, options) {
  return useMutation(
    ({id}) => client(`list-items/${id}`, {method: 'DELETE', token: user.token}),
    {
      onMutate(newItem) {
        const previousItems = queryCache.getQueryData('list-items')

        queryCache.setQueryData('list-items', old => {
          return old.filter(item => item.id !== newItem.id)
        })

        return () => queryCache.setQueryData('list-items', previousItems)
      },
      ...defaultMutationOptions,
    },
  )
}

function useListItem(user, bookId) {
  const listItems = useListItems(user)
  return listItems.find(li => li.bookId === bookId) || null
}

function useUpdateItems(user, options) {
  return useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        method: 'PUT',
        data: updates,
        token: user.token,
      }),
    {
      onMutate(newItem) {
        const previousItems = queryCache.getQueryData('list-items')

        queryCache.setQueryData('list-items', old => {
          return old.map(item => {
            return item.id === newItem.id ? {...item, ...newItem} : item
          })
        })

        return () => queryCache.setQueryData('list-items', previousItems)
      },
      ...defaultMutationOptions,
      ...options,
    },
  )
}

function useCreateListItem(user, options) {
  return useMutation(
    ({bookId}) =>
      client('list-items', {
        data: {bookId},
        token: user.user.token,
      }),
    {
      ...defaultMutationOptions,
      ...options,
    },
  )
}
export {
  useCreateListItem,
  useListItem,
  useListItems,
  useRemoveListItem,
  useUpdateItems,
}
