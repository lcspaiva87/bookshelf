const { useQuery, useMutation, queryCache } = require("react-query/dist/react-query.development");
const { client } = require("./api-client");
function useListItems(user) {
  const {data: listItem} = useQuery({  
    queryKey: 'list-items',
    queryFn: () => client('list-items', {token: user.token}).then(data => data.listItems),

    
   })
   return listItem || []
} 


const defaultMutationOptions= {
    onSettled: () => queryCache.invalidateQueries('list-items'),
    throwOnError: true,
}
function useRemoveListItem(user,options) {
    return useMutation(
        ({listItemId}) => {
            return client(`list-items/${listItemId}`, {
                method: 'DELETE',
                token: user.token,
            })
        },
        {
            ...defaultMutationOptions,...options
        }
    )
}
function useListItem(user,bookId) {
    const listItems = useListItems(user)
return listItems.find(li => li.bookId === bookId) || null
}
function useUpdateItems(user,options) {
    return useMutation(
        updates => {
            return client('list-items', {
                method: 'PUT',
                data: updates,
                token: user.token,
            })
        },
        {
            ...defaultMutationOptions,...options
        }
    )
}
function useCreateListItem(user,options){
    return useMutation(
        ({bookId}) =>
        client('list-items', {
            data: {bookId},
            token: user.user.token,
        }),
        {
            ...defaultMutationOptions,...options
        }
    )
}
export { useCreateListItem, useListItem, useListItems, useRemoveListItem, useUpdateItems };

