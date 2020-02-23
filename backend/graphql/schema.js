const graphql = require('graphql')

const { GraphQLObjectType,
        GraphQLString,
        GraphQLArray,
        GraphQLList,
        GraphQLSchema,
        GraphQLID } = graphql;

// dummydata
var descendents = [
    { name: 'Kevin', id: '1'},
    { name: 'Connie', id: '2'},
    { name: 'Jeff', id: '3'}
]

var photos = [
    { path: 'sample1', id: '1', personId: ['1']},
    { path: 'sample2', id: '2', personId: ['2','3']}
]


const DescendentType = new GraphQLObjectType({
    name: 'Descendent',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        // info: {type: GraphQLString},
        // children: {type: GraphQLArray},
        // spouse: {type: GraphQLArray}
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
                return descendents.filter(d => parent.personId.includes(d.id))
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
            resolve(parent, args) {
                //code to get data from db / other source
                 for (let d of descendents) {
                     if (d.id === args.id){
                        return d
                     }
                 }
            }
        },
        photo: {
            type: PhotoType,
            args: { id: {type: GraphQLID}},
            resolve(parent, args) {
                for (let p of photos) {
                    if (p.id === args.id) {
                        return p
                    }
                }
            }
        },
        photos: {
            type: new GraphQLList(PhotoType),
            resolve(parent, args) {
                return photos
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery
})