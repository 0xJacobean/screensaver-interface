export default function Banner() {
  return (
    <div className={'flex-col'}>
    <div className="relative bg-red-400 w-full">
      <div className="max-w-7xl mx-auto py-2 px-3 sm:px-6 lg:px-8">
        <div className="flex-col space-y-2 md:space-y-0 md:flex-row sm:text-center sm:px-16 font-medium text-white flex justify-between items-center">

            <span className="text-sm md:text-md">🚧 Beta software. Use at your own risk. 💀</span>
            <a target='_blank' href='https://jam.screensaver.world' className="inline text-sm py-2 px-3 bg-black rounded-md">✨ Flash Auction Friday 8PM EST 🎨</a>
        </div>
      </div>
    </div>
    {/* <div className="relative bg-black w-full border-white">
    <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
      <div className=" sm:text-center sm:px-16 font-small text-white flex justify-center">
          <a target='_blank' href='https://jam.screensaver.world' className="inline text-md">✨ Join the Flash Auction this Friday at 8PM EST 🎨</a>
      </div>
    </div>
  </div> */}
  </div>
  )
}