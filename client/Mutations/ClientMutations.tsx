import { gql } from "@apollo/client";

export const DELETE_CLIENT =gql`
    mutation deleteClient($id: ID!){
        deleteClient(id: $id) {
            id
        }
    }
`

export const ADD_CLIENT =gql`
    mutation addClient($name : String! , $email : String! , $phone : String!){
        addClient(name:$name , phone:$phone, email:$email){
            id
            name
            email
            phone
        }
    }
`

