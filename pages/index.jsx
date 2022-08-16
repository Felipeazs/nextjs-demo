import React, { Fragment } from 'react'
import Head from 'next/head'

import { MongoClient } from 'mongodb'

import MeetupList from '../components/meetups/MeetupList'

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        {/* for tabs title */}
        <title>React Meetups</title>
        {/* for search engines */}
        <meta name="description" content="Browse list of react meetups" />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  )
}

//export const getServerSideProps = async (context) => {
// fetch data from api
// No revalidate needed. The page its regenerated for every upcoming requests,
// but its slower for pages that don't change constantly
//   const req = context.req
//   const res = context.res

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   }
// }

export const getStaticProps = async () => {
  //fetch data from api
  //runs only in server-side

  const client = await MongoClient.connect(
    'mongodb+srv://felipez:v6Lk7hpriRdaU4@academind.kpncuhg.mongodb.net/meetups?retryWrites=true&w=majority',
  )
  const db = client.db()

  const meetupsCollection = db.collection('meetups')

  const meetups = await meetupsCollection.find().toArray()

  client.close()

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10, //re-generate every 10 seconds (data update)
  }
}

export default HomePage
