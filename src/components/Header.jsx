// 'use client'
// import React, { useState } from 'react'
// import { Search, Mail, Bell, X } from 'lucide-react'

// export default function DashboardHeader({ title = 'Dashboard', onSearch }) {
//   const [showSearch, setShowSearch] = useState(false)
//   const [searchTerm, setSearchTerm] = useState('')

//   const handleSearch = (e) => {
//     const value = e.target.value
//     setSearchTerm(value)
//     if (onSearch) onSearch(value) // Pass to parent if needed
//   }

//   return (
//     <div
//       className='px-12 py-6 flex items-center justify-between'
//       style={{ background: '#f2f0fe' }}
//     >

//       <div>
//         {/* Title or Search Box */}
//         <div className='flex items-center gap-3'>
//           {showSearch ? (
//             <div className='flex items-center bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200'>
//               <Search className='w-4 h-4 text-gray-600 mr-2' />
//               <input
//                 type='text'
//                 placeholder='Search...'
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 className='outline-none text-gray-700 w-64 bg-transparent'
//                 autoFocus
//               />
//               <button
//                 onClick={() => {
//                   setShowSearch(false)
//                   setSearchTerm('')
//                 }}
//                 className='ml-2 text-gray-500 hover:text-gray-700'
//               >
//                 <X className='w-4 h-4' />
//               </button>
//             </div>
//           ) : (
//             <h1 className='text-2xl font-semibold text-gray-800'>{title}</h1>
//           )}
//         </div>
//         {/* Icons */}
//         <div className='flex items-center gap-4'>
//           {!showSearch && (
//             <button
//               className='p-2 hover:bg-gray-100 rounded-lg'
//               onClick={() => setShowSearch(true)}
//             >
//               <Search className='w-5 h-5 text-gray-600' />
//             </button>
//           )}
//           <button className='p-2 hover:bg-gray-100 rounded-lg'>
//             <Mail className='w-5 h-5 text-gray-600' />
//           </button>
//           <button className='p-2 hover:bg-gray-100 rounded-lg relative'>
//             <Bell className='w-5 h-5 text-gray-600' />
//             <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
//           </button>
//         </div>
//       </div>

//     </div>
//   )
// }


'use client'
import React, { useState } from 'react'
import { Search, Mail, Bell, X } from 'lucide-react'

export default function DashboardHeader({ title = 'Dashboard', onSearch }) {
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    if (onSearch) onSearch(value)
  }

  return (
    <div
      className="px-12 py-6 flex items-center justify-between w-full"
      style={{ background: '#f2f0fe' }}
    >
      {/* LEFT: Dashboard */}
      <div className="flex items-center gap-3">
        {showSearch ? (
          <div className="flex items-center bg-white px-3 py-2 rounded-lg border">
            <Search className="w-4 h-4 mr-2" />
            <input
              value={searchTerm}
              onChange={handleSearch}
              className="outline-none w-64"
              autoFocus
            />
            <button onClick={() => setShowSearch(false)}>
              <X className="w-4 h-4 ml-2" />
            </button>
          </div>
        ) : (
          <h1 className="text-2xl font-semibold text-gray-800">
            {title}
          </h1>
        )}
      </div>

      {/* RIGHT: Icons (top-right end) */}
      <div className="flex items-center gap-4">
        {!showSearch && (
          <button onClick={() => setShowSearch(true)}>
            <Search className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <Mail className="w-5 h-5 text-gray-600" />
        <Bell className="w-5 h-5 text-gray-600" />
      </div>
    </div>
  )
}
