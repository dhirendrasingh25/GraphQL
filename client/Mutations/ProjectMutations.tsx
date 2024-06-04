import { gql } from "@apollo/client";

export const ADD_PROJECTS=gql`
mutation addProject($name: String!,$description: String! , $status: ProjectStatus! , $clientId: ID!){
    addProject(name:$name , description:$description , status: $status, clientId:$clientId){
      id
    } 
  }
`