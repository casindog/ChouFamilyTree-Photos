import gql from 'graphql-tag'

const getGGFQuery = gql`
    {
        descendent(id: "5e5373a07ffd4c292be15f36"){
            id name info
            spouse {
                id name
            }
            children {
                id name info
                spouse {
                    id name
                }
                children {
                    id name info
                    spouse {
                        id name
                    }
                    children {
                        id name info
                        spouse {
                            id name
                        }
                        children {
                            id name info
                            spouse {
                                id name
                            }
                            children {
                                id name info
                                spouse {
                                    id name
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`

const getPhoto =gql`
{
    photo(id: $id) {
        id path 
        persons {
            id name
        }
    }
}
`

const getAlbum = gql`
{ 
    photos {
        id path
        persons {
            id name
        }
    }   
}
`



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

export {getGGFQuery, getPhoto, getAlbum, editPhotoTagsMutation}