import React, { Fragment } from 'react'
import Head from 'next/head'

import { MongoClient, ObjectId } from 'mongodb'

import MeetupDetail from '../../components/meetups/MeetupDetail'

const MeetupDetails = (props) => {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  )
}

export const getStaticPaths = async () => {
  //Pre-generate must popular routes (ex. articles in blogs)
  // fetch meeupts for pre-generate

  const client = await MongoClient.connect(
    'mongodb+srv://felipez:v6Lk7hpriRdaU4@academind.kpncuhg.mongodb.net/meetups?retryWrites=true&w=majority',
  )
  const db = client.db()

  const meetupsCollection = db.collection('meetups')

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray()

  client.close()

  return {
    fallback: 'blocking', //true or blocking if every page needs to be pre-generated dynamically
    paths: meetups.map((meetup) => ({
      params: { ['meetup-id']: meetup._id.toString() },
    })),
  }
}

export const getStaticProps = async (context) => {
  // get url params outside the component
  const meetupId = context.params['meetup-id']

  // fetch one meeupt for display in details
  const client = await MongoClient.connect(
    'mongodb+srv://felipez:v6Lk7hpriRdaU4@academind.kpncuhg.mongodb.net/meetups?retryWrites=true&w=majority',
  )
  const db = client.db()

  const meetupsCollection = db.collection('meetups')

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  })

  client.close()

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  }
}

export default MeetupDetails
