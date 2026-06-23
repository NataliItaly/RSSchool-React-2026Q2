import Link from 'next/link';

export default function About() {
  return (
    <div className="w-full min-h-full flex justify-center items-center">
      <div className="p-5 max-w-md flex flex-col items-center gap-4">
        <p className="text-center flex flex-col">
          <span>This App is made by a student of</span>
          <span className="text-lg">RS School&rsquo;s course</span>
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-700 text-xl font-bold"
          >
            React 2026 Q2
          </a>
        </p>
        <a
          href="https://github.com/NataliItaly"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-14 h-14 rounded-full border-4 border-[#BFDE42] overflow-hidden hover:rotate-y-180 transition-all duration-700"
        >
          <img className="w-full" src="/github.svg" alt="GitHub Profile" />
        </a>
        <a
          href="https://rs.school"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-14 h-14 rounded-full border-4 border-[#ffb749] overflow-hidden hover:rotate-y-180 transition-all duration-700"
        >
          <img className="w-full" src="/rss-logo.svg" alt="RS School logo" />
        </a>
        <Link
          href="/"
          className="flex justify-center items-center px-5 py-2.5 bg-pink-700 text-white rounded-md hover:bg-pink-500 transition-all duration-500 cursor-pointer"
        >
          Back to Main
        </Link>
      </div>
    </div>
  );
}
