const { useQuery, useMutation, queryCache } = require("react-query/dist/react-query.development");
const { client } = require("./api-client");
function useListItems(user) {
  const {data: listItem} = useQuery({  
    queryKey: 'list-items',
    queryFn: () => client('list-items', {token: user.token}).then(data => data.listItems),

    
   })
   return listItem || []
} 
function useListItem(user,bookId) {
    const listItems = useListItems(user)
return listItems.find(li => li.bookId === bookId) || null
}
function useUpdateItems(user) {
    return useMutation(
        updates => {
            return client('list-items', {
                method: 'PUT',
                data: updates,
                token: user.token,
            })
        },
        {
            onSettled: () => queryCache.invalidateQueries('list-items'),
        }
    )
}
export { useListItem, useListItems, useUpdateItems };
