import gql from 'graphql-tag'

const editPhotoTagsMutation = gql`
mutation($photoId: ID!, $personId: ID!, $action: String!) {
    editTagsToPhoto(photoId: $photoId, personId: $personId, action: $action) {
        id path 
        persons {
            id name
        }
    }
}
`

const editSelectedMutation = gql`
mutation ($id: ID!, $name: String!) {
    patchDescendent(id: $id, name: $name) {
        id name
    }
}
`

export {editPhotoTagsMutation, editSelectedMutation}