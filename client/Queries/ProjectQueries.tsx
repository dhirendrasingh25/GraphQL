import { gql} from '@apollo/client'


export const GET_PROJECTS = gql`
    query{
        projects{
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