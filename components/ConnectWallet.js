import { PlusIcon } from '@heroicons/react/solid'

export default function Example({connect}) {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-medium text-gray-900">No wallet</h3>
      <p className="mt-1 text-sm text-gray-500">Get started by connecting your Ethereum wallet.</p>
      <div className="mt-6">
        <button
          type="button"
          onClick={connect}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Connect Wallet
        </button>
      </div>
    </div>
  )
}
