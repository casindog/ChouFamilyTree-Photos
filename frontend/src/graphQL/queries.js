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

export {getGGFQuery, getAlbum}