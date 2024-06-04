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