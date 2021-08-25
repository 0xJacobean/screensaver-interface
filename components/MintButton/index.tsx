import React from 'react'
import { useState } from 'react'
import Modal from '../Modal'
import { useWeb3React } from '@web3-react/core'
import { shortenAddress } from '../../utils'
import { Web3Provider } from '@ethersproject/providers'
import { useEffect } from 'react'
import { POLYGON_MAINNET_PARAMS } from '../../constants'
import { ethers } from 'ethers'
import { GALLERY_ABI } from '../../constants/gallery'
import classNames from 'classnames'
import { Router, useRouter } from 'next/router'
import { LibraryIcon } from '@heroicons/react/outline'
import { BigNumber } from 'ethers'
import { getNetworkLibrary } from '../../connectors'

var utils = require('ethers').utils

interface IProps {
  hash: string
}

const index: React.FC<IProps> = ({ hash }) => {
  const [open, setOpen] = useState(false)
  const [initialSupply, setInitialSupply] = useState<number | null>(null)
  const [supply, setSupply] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const { chainId, account, library } = useWeb3React<Web3Provider>()

  async function createToken(uri: string) {
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ID,
      GALLERY_ABI,
      library.getSigner(account),
    )

    setLoading(true)

    let tx = await contract.createToken(uri)

    const receipt = await tx.wait();

    goToNFT()

  }

  async function goToNFT() {
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ID,
      GALLERY_ABI,
      library.getSigner(account),
    )

    var supply = await contract.totalMinted()

    console.log("SUPPLY", supply)

    var parsedSupply = supply.toNumber()

    router.push(`/object/${parsedSupply}`)
  }

  return (
    <>
      <Modal
        status={chainId !== 137 ? 'switch-network' : 'connect'}
        open={open}
        setOpen={setOpen}
      />

      <div className={'mr-2'}>
        <button
          disabled={loading}
          onClick={
            !account || chainId !== 137
              ? () => setOpen(true)
              : () => createToken(`https://ipfs.io/ipfs/${hash}`)
          }
          className="mt-4 w-60 justify-center inline-flex items-center px-6 py-3 border bg-red-300 shadow font-bold text-2xl rounded-full text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Mint
          {loading && (
            <svg
              className="animate-spin -mr-1 ml-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
        </button>
      </div>
    </>
  )
}

export default index
