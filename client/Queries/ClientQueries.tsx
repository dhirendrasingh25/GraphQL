import { gql} from '@apollo/client'

export const GET_CLIENTS = gql`
  query {clients{
    name,
    email,
    phone,
    id
  }}
`;