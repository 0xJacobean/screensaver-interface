import React, { useState, useEffect } from 'react'
import NFTItemCard from '../components/NFTItemCard'
import { Layout } from '../components'
import { useRouter } from 'next/router'
import axios from 'axios'
import { ethers } from 'ethers'
import { GALLERY_ABI } from '../constants/gallery'
import { getNetworkLibrary } from '../connectors'
import NFT from '../types'
import SearchBar from '../components/SearchBar'
import { shortenAddress } from '../utils'
import AccountId from '../components/AccountId'
import { gql, useQuery , FetchPolicy } from "@apollo/client";
import { GraphQLObjectType, GraphQLList, GraphQLID } from "graphql";


interface IProps {
  collection: boolean
}

const GALLERY_QUERY = gql`query HomePage($skip: Int) {
  artworks(first: 20 skip: $skip orderBy: creationDate orderDirection: desc) {
    id
    tags
    mimeType
    size
    mediaUri
    tokenId
    description
    name
    creationDate
    creator {
      id
    }
    owner {
      id
    }
  }
}`

// const eventsType = new GraphQLObjectType({
//   name: 'events',
//   type: ,
//   args: {
//     containsId: new GraphQLList(GraphQLID)
//   }
// });

const ExploreView: React.VFC<IProps> = ({ collection }) => {
  const [openTab, setOpenTab] = useState<'active' | 'completed'>('active')
  const [nfts, setNfts] = useState<NFT[]>([])
  const [filteredNfts, setFilteredNfts] = useState<NFT[]>([])
  const router = useRouter()
  const { account } = router.query
  const [uri, setUri] = useState<undefined | string>()
  // const [loading, setLoading] = useState<boolean>(true)
  const [metadata, setMetadata] = useState<NFT | undefined>()
  const [offset, setOffset] = useState<number>(0)
  const [count, setCount] = useState<number>(collection ? 99 : 12)
  const [noMore, setNoMore] = useState<boolean>(false)
  const [input, setInput] = useState('')

  const { loading, error, data, fetchMore } = useQuery(GALLERY_QUERY, {
    variables: {
      skip: 0
    }
  })

  useEffect(() => {
    console.log("DATA HERE IS", data)
  }, [data])


  async function getMetadata() {
    var meta = await axios.get(uri)
    console.log(meta)
    var tempMetadata = meta.data
    tempMetadata.creationDate = new Date(meta.data.creationDate).toString()
    setMetadata(tempMetadata)
  }

  const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
        return previousResult;
    }

    console.log("FAetHY", fetchMoreResult)
    const previousEdges = previousResult.edges;
    const fetchMoreEdges = fetchMoreResult.edges;

    fetchMoreResult.edges = [...previousEdges, ...fetchMoreEdges];

    return { ...fetchMoreResult }
}

  async function loadTokens() {

    console.log("FETCH MORE")
    // if (fetchMore === undefined) return;

    await fetchMore(
      
      {
        variables: {
      skip: 20
    },
    updateQuery
    
  })
    
    // if (offset === 0) {
    //   // setLoading(true)
    // }

    // const contract = new ethers.Contract(
    //   process.env.NEXT_PUBLIC_CONTRACT_ID,
    //   GALLERY_ABI,
    //   getNetworkLibrary(),
    // )

    // var totalSupply = await contract.totalSupply()

    // var total = totalSupply.toNumber()

    // if (total <= count) {
    //   setNoMore(true)
    // }

    // var lowRange
    // var range
    // var result

    // if (offset === 0) {
    //   lowRange = total - count

    //   lowRange = lowRange <= 0 ? 0 : lowRange

    //   range = total - lowRange

    //   result = new Array(range).fill(true).map((e, i) => i + 1 + lowRange)
    // } else {
    //   lowRange = offset - count

    //   range = offset - lowRange

    //   result = new Array(range).fill(true).map((e, i) => i + 1 + lowRange)
    // }

    // console.log(total, result)

    // if (result.filter((i) => i <= 0).length > 1) {
    //   setNoMore(true)
    // }

    // const filteredResults = result.filter((i) => i > 0)

    // console.log(total, filteredResults)

    // await getNFTs(filteredResults)

    // // set new offset
    // setOffset(lowRange)
    // // setLoading(false)
  }

  const getNFTs = async (range: number[]) => {
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ID,
      GALLERY_ABI,
      getNetworkLibrary(),
    )

    var collectedNFTs = []

    var allMetadata = await Promise.all(
      range.map(async (id) => {
        if (id === 122) return null
        var uri = await contract.tokenURI(id)
        console.log('URI HEERER', uri)

        if (uri.includes(undefined)) return null
        var metadata = await axios.get(uri)
        metadata.data.tokenId = id
        console.log(metadata)

        if (collection) {
          var ownerOf = await contract.ownerOf(id)
          console.log('COLLECTED THIS', account, ownerOf)

          if (ownerOf === account) {
            collectedNFTs.push(metadata.data)
          }
        }
        return metadata.data
      }),
    )

    const filteredMeta = allMetadata.filter((i) => i !== null)
    const filteredCollected = collectedNFTs.filter((i) => i !== null)

    if (collection) {
      setNfts([...nfts, ...filteredCollected.reverse()])
    } else {
      setNfts([...nfts, ...filteredMeta.reverse()])
    }
  }

  useEffect(() => {
    updateInput(input)
  }, [nfts])

  const updateInput = async (input) => {
    if (input === '') {
      setFilteredNfts(nfts)
    }

    const filtered = nfts.filter((nft) => {
      return JSON.stringify(nft).toLowerCase().includes(input.toLowerCase())
    })
    setInput(input)
    setFilteredNfts(filtered)
  }

  useEffect(() => {
    console.log('ACCOUNT is here', account)
    if (!account && !!collection) return
    // loadTokens()
  }, [account, collection])

  if (loading) return <Layout><div className={'md:mt-12 pb-8 max-w-xl mx-auto'}>Loading...</div></Layout>
  // if (loading) return 'Loading...'
  // if (error) return 'Something Bad Happened'

  return (
    <div className={'flex flex-col space-y-4 '}>
      <div
        className={'grid gap-6 md:grid-cols-2 lg:grid-cols-3 mx-auto mt-24 '}
      >
        {!collection ? (
          <SearchBar input={input} onChange={updateInput} />
        ) : (
          <div className={'absolute -mt-16 text-3xl font-bold'}>
            <AccountId address={account.toString()} />
          </div>
        )}
        {!loading
          ? data.artworks.map((item, key) => (
              <div key={key}>
                <NFTItemCard
                  nft={item}
                  title={item?.name}
                  coverImageSrc={item?.image}
                  creator={item?.creator}
                  endDateTime={new Date('1/1/count00')}
                  amountCollected={count}
                  tokenId={item?.tokenId}
                />
              </div>
            ))
          : <NFTItemCard loading={true} /> }
      </div>
      {!noMore && (
        <button
          onClick={() => loadTokens()}
          className="mt-4 w-full justify-center inline-flex items-center px-6 py-3 border border-red-300 shadow-sm text-red-300 font-medium rounded-xs text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Load More
        </button>
      )}
    </div>
  )
}

export default ExploreView
