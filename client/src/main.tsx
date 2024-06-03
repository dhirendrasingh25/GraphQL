import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import React from 'react';


const cache = new InMemoryCache({
  typePolicies:{
    Query:{
      fields:{
        clients:{
          merge(existing,incoming){
            return incoming
          }
        },
        projects:{
          merge(existing,incoming){
            return incoming
          }
        }
      }
    }
  }
})

const server = import.meta.env.VITE_SERVER_URI
console.log(server);
const client = new ApolloClient({
  uri: server,
  cache
});



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  </React.StrictMode>,
)
