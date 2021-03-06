const graphql = require('graphql')
const Descendent = require('../models/Descendent')
const Photo = require('../models/Photo')

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
        children: {
            type: new GraphQLList(DescendentType),
            resolve(parent, _) {
                return Descendent.find({ '_id': { $in: parent.children} })
            }
        },
        spouse: {
            type: new GraphQLList(DescendentType),
            resolve(parent, _) {
                return Descendent.find({ '_id': { $in: parent.spouse}})
            }
        }
    })
})

const PhotoType = new GraphQLObjectType({
    name: 'Photo',
    fields: () => ({
        id: {type: GraphQLID},
        path: {type: GraphQLString},
        persons: {
            type: new GraphQLList(DescendentType),
            resolve(parent, _) {
                return Descendent.find({ '_id': { $in: parent.persons } })
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
                return Descendent.findByIdAndUpdate(args.id,args, (err, descendent) => {
                    descendent.name = args.name || descendent.name
                    descendent.info = args.info || descendent.info
                    descendent.save()
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
        createPhoto: {
            type: PhotoType,
            args: {
                path: {type: GraphQLString},
            },
            resolve(_, args) {
                let photo = new Photo({
                    path: args.path,
                })
                return photo.save()
            }
        },
        editTagsToPhoto: {
            type: PhotoType,
            args: {
                photoId: {type: GraphQLID},
                personId: {type: GraphQLID},
                action: {type: GraphQLString}
            },
            resolve(_, args) {
                return new Promise((resolve, reject) => {
                    return Photo.findById(args.photoId, (_, photo) => {
                        if (photo) {
                            if (args.action==='add') {
                                if (checkPersonsArr(photo.persons, args.personId)) {
                                    photo.persons.push(args.personId)
                                }
                            } else if (args.action==='del') {
                                for (let i=0; i<photo.persons.length; i++) {
                                    if (photo.persons[i]===args.personId) {
                                        photo.persons.splice(i,1)
                                    }
                                }
                            }
                            photo.save((err, res) => {
                                if (err) reject(err)
                                resolve(res)
                            })
                        }
                    })
                })

                function checkPersonsArr(arr, id) {
                    for (let personId of arr) {
                        if (personId===id) return false
                    }
                    return true
                }
            }
        }

    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})