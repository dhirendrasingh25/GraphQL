import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';


const server = import.meta.env.VITE_SERVER_URI
console.log(server);
const client = new ApolloClient({
  uri: server,
  cache: new InMemoryCache(),
});



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
