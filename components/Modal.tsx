/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
// import { CheckIcon } from '@heroicons/react/outline'
import { shortenAddress, getSigner } from '../utils'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { injected } from '../connectors'
import styles from '../styles/Wallet.module.css'
import { useGalleryContract } from '../hooks/useContract'
import { ethers } from 'ethers'
import { GALLERY_ABI } from '../constants/gallery'

interface IProps {
    status: string
  open: boolean
  setOpen: (open: boolean) => void
}

const SwitchView = () => {

    return (
        <div className={' m-4'}>
        <div>
            <div className="mt-3 text-center sm:mt-5">
            <Dialog.Title
                as="h3"
                className="text-xl leading-6 font-bold text-gray-900"
            >
                Switch to Matic
            </Dialog.Title>
            </div>
        </div>
            {/* <div className="mt-5 sm:mt-5"> */}
            <button className="h-0 w-0 overflow-hidden"/>

                <p className={"text-gray-700 mb-4"} >RedPill runs on Matic. Switch your Metamask network to Matic.</p>
                <a className={"text-gray-700 underline mt-8"}>Learn more.</a>
            {/* </div> */}
        </div>
    )
}

const ConnectView = () => {
    const {
        chainId,
        account,
        activate,
        active,
        deactivate,
        library,
      } = useWeb3React<Web3Provider>()

    return (
        <div>
        <div>
        <div className="mt-3 text-center sm:mt-5">
          <Dialog.Title
            as="h3"
            className="text-xl leading-6 font-bold text-gray-900"
          >
            {!account
              ? 'Connect Your Wallet'
              : shortenAddress(account)}
          </Dialog.Title>
        </div>
      </div>
      <div className="mt-5 sm:mt-6">
        <button
          type="button"
          onClick={!account ? () => activate(injected) : deactivate}
          className="inline-flex items-center px-6 py-3 shadow-sm text-base font-medium rounded-md text-white bg-red-300"
        >
          {!account ? 'Connect with Metamask' : 'Deactivate'}
        </button>

        <div className="mt-4">
          <p className="text-sm text-gray-500">New to Ethereum?</p>
          <a>Learn more about wallets</a>
        </div>
      </div>
      </div>
    )
}

function ModalViews({ status }) {
    return (
      <div>
        {(() => {
          switch (status) {
            case 'connect':
              return <ConnectView />;
            case 'switch-network':
                return <SwitchView />;
                // case 'error':
                //     return <ConnectView />;
                    default:
              return null;
          }
        })()}
      </div>
    );
  }

const Modal: React.VFC<IProps> = ({ status, open, setOpen }) => {

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        open={open}
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-center overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
             
            <ModalViews status={status} />
            
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Modal
