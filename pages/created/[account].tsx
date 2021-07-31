import React, { useEffect, useState } from 'react'
import { Layout, Navbar } from '../../components'
import { useRouter } from 'next/router'
import Head from 'next/head'
import axios from 'axios'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { GALLERY_ABI } from '../../constants/gallery'
import { getNetworkLibrary } from '../../connectors'
import NFT from '../../types'
import ExploreView from '../ExploreView'

const CollectionPage: React.VFC = () => {
  const router = useRouter()
  const { account } = router.query
  
  return (
    <Layout>
      <Head>
        <title>Screensaver.world | Created by {account.toString()}</title>
      </Head>
      <div className={'md:mt-12 pb-8 w-11/12 mx-auto'}>
        <ExploreView created={true}/>
      </div>
    </Layout>
  )
}

export default CollectionPage
