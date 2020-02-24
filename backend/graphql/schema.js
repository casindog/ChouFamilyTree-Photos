const graphql = require('graphql')
const Descendent = require('../models/Descendent')
const Photo = require('../models/Photo')
// const Tree = require('../models/Tree')
const Relationship = require('../models/Relationship')

const { GraphQLObjectType,
        GraphQLString,
        GraphQLList,
        GraphQLSchema,
        GraphQLID,
        GraphQLNonNull } = graphql;


const DescendentType = new GraphQLObjectType({
    name: 'Descendent',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        info: {type: GraphQLString},
    })
})

const RelationshipType = new GraphQLObjectType({
    name: 'Relationship',
    fields: () => ({
        id: {type: GraphQLID},
        parentId: {type: GraphQLID},
        childId: {type: GraphQLID},
        spouseId: {type: GraphQLID}
    })
})

const PhotoType = new GraphQLObjectType({
    name: 'Photo',
    fields: () => ({
        id: {type: GraphQLID},
        path: {type: GraphQLString},
        persons: {
            type: new GraphQLList(DescendentType),
            resolve(parent, args) {
                let arr = parent.persons.map(ele => ele.personId)
                return Descendent.find({ '_id': { $in: arr } })
            } 
        }
    })
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        descendent: {
            type: DescendentType,
            args: {id: {type: GraphQLID}},
            resolve(_, args) {
                return Descendent.findById(args.id)
            }
        },
        descendents: {
            type: new GraphQLList(DescendentType),
            resolve() {
                return Descendent.find()
            }
        },
        photo: {
            type: PhotoType,
            args: { id: {type: GraphQLID}},
            resolve(_, args) {
                return Photo.findById(args.id)
            }
        },
        photos: {
            type: new GraphQLList(PhotoType),
            resolve() {
                return Photo.find()
            }
        }
    }
})


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createDescendent: {
            type: DescendentType,
            args: {
                name: {type: GraphQLString},
                info: {type: GraphQLString},
            },
            resolve(_, args) {
                let descendent = new Descendent({
                    name: args.name,
                    info: args.info,
                })
                return descendent.save()
            }
        },
        patchDescendent: {
            type: DescendentType,
            args: {
                id: {type: GraphQLID},
                name: {type: GraphQLString},
                info: {type: GraphQLString},
            },
            resolve(_, args) {
                Descendent.findById(args.id, (err, descendent) => {
                    descendent.name = args.name || descendent.name
                    descendent.info = args.info || descendent.info
                    return descendent.save()
                })
            }
        },
        deleteDescendent: {
            type: DescendentType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(_, args) {
                return Descendent.findByIdAndDelete(args.id)
            }
        },
        createRelationship: {
            type: RelationshipType,
            args: {
                parentId: {type: GraphQLID},
                childId: {type: GraphQLID}
            },
            resolve(_, args) {
                let relationship = new Relationship({
                    parentId: args.parentId,
                    childId: args.childId
                })
                return relationship.save()
            }
        },
        deleteRelationship: {
            type: RelationshipType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(_, args) {
                return Relationship.findByIdAndDelete(args.id)
            }
        },
        addPhoto: {
            type: PhotoType,
            args: {
                path: {type: GraphQLString},
                // persons: {type: GraphQLList(DescendentType)}
            },
            resolve(_, args) {
                let photo = new Photo({
                    path: args.path,
                    // persons: []
                })
                return photo.save()
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})