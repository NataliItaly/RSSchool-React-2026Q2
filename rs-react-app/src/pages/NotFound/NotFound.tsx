import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-5 max-w-96 flex flex-col gap-4 items-center">
        <p className="text-indigo-700 font-bold text-5xl">404</p>
        <p className="text-2xl">Page not found</p>
        <Link to='/' className="flex justify-center items-center px-5 py-2.5 bg-pink-700 text-white rounded-md hover:bg-pink-500 transition-all duration-500 cursor-pointer">Back to Main</Link>
      </div>
    </div>
  )
}