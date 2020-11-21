import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

// TODO: add alike count again
const FETCH_POSTS_QUERY = gql`
{
  getPosts{
    id
    createdAt
    username
    comments{
      id
      body
      username
  		createdAt
    }
    likes{
      username
    }
  }
}
`;

function Home() {
    const {loading, data} = useQuery(FETCH_POSTS_QUERY)
    if (loading){
        while (loading){
            console.log("loading...")
        }
    }
    if (data){
        console.log(data);
    }
    return (
        <div>
            <h1>Home page</h1>
        </div>
    );

}



export default Home