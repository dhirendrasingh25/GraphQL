import { gql} from '@apollo/client'


export const GET_PROJECTS = gql`
    query{
        projects{
            id
            name
            status
            description
            client{
                name
                email
                phone
            }
        }   
    }
`;

export const GET_PROJECT_BY_ID =gql`
    query($id: ID!){
        project(id:$id){
            id
            name
            status
            description
        }
    }
`