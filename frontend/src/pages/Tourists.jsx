import { useEffect, useState } from 'react'
import axios from 'axios'

import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function Tourists() {
  const [tourists, setTourists] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/tourists')
      .then((response) => {
        console.log('Tourists from API:', response.data)
        setTourists(response.data)
      })
      .catch((error) => {
        console.error('Error fetching tourists:', error)
      })
  }, [])

  const filteredTourists = tourists.filter((tourist) => {
    const fullName =
      `${tourist[1] || ''} ${tourist[2] || ''} ${tourist[3] || ''}`.trim()

    const nationality = tourist[6] || ''
    const email = tourist[7] || ''

    const searchTerm = search.toLowerCase()

    return (
      fullName.toLowerCase().includes(searchTerm) ||
      nationality.toLowerCase().includes(searchTerm) ||
      email.toLowerCase().includes(searchTerm)
    )
  })

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
        <div>
          <p className="text-sm text-[#8B7355] mb-2">
            Traveller directory
          </p>

          <h2 className="font-['Playfair_Display'] text-4xl text-[#1C1C1C]">
            Tourists
          </h2>

          <p className="text-sm text-[#77736D] mt-2">
            Manage registered tourists and their travel activity.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 bg-[#1C1C1C] text-white px-5 py-3 rounded-lg text-sm hover:bg-[#333333] transition">
          <Plus size={17} />
          Add tourist
        </button>
      </div>

      {/* Search */}
      <div className="flex mb-6">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#99958E]"
          />

          <input
            type="text"
            placeholder="Search tourists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#E6E1D8] rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#8B7355] transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E6E1D8] rounded-xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>
              <tr className="border-b border-[#E6E1D8]">

                <th className="px-6 py-4 text-[11px] uppercase tracking-wider font-medium text-[#99958E]">
                  Tourist
                </th>

                <th className="px-6 py-4 text-[11px] uppercase tracking-wider font-medium text-[#99958E]">
                  Contact
                </th>

                <th className="px-6 py-4 text-[11px] uppercase tracking-wider font-medium text-[#99958E]">
                  Nationality
                </th>

                <th className="px-6 py-4 text-[11px] uppercase tracking-wider font-medium text-[#99958E]">
                  Gender
                </th>

                <th className="px-6 py-4 text-[11px] uppercase tracking-wider font-medium text-[#99958E]">
                  Location
                </th>

                <th className="px-6 py-4 text-[11px] uppercase tracking-wider font-medium text-[#99958E]">
                  Tourist ID
                </th>

                <th className="px-6 py-4"></th>

              </tr>
            </thead>

            <tbody>

              {filteredTourists.map((tourist) => {

                const touristId = tourist[0]

                const fullName =
                  `${tourist[1] || ''} ${tourist[2] || ''} ${tourist[3] || ''}`.trim()

                const gender = tourist[4]
                const nationality = tourist[6]
                const email = tourist[7]

                const street = tourist[8]
                const city = tourist[9]
                const state = tourist[10]

                return (
                  <tr
                    key={touristId}
                    className="border-b border-[#F0ECE5] last:border-0 hover:bg-[#FCFBF8] transition"
                  >

                    {/* Tourist */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-[#E9E1D5] flex items-center justify-center text-xs font-medium text-[#6F5D49]">
                          {getInitials(fullName)}
                        </div>

                        <div>

                          <p className="text-sm font-medium text-[#1C1C1C]">
                            {fullName}
                          </p>

                          <p className="text-xs text-[#99958E] mt-0.5">
                            Traveller
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Contact */}
                    <td className="px-6 py-5">

                      <div className="space-y-1.5">

                        <div className="flex items-center gap-2 text-xs text-[#77736D]">
                          <Mail size={13} />
                          {email || 'No email'}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#99958E]">
                          <Phone size={13} />
                          <span>Phone available</span>
                        </div>

                      </div>

                    </td>

                    {/* Nationality */}
                    <td className="px-6 py-5">
                      <span className="text-sm text-[#77736D]">
                        {nationality || '—'}
                      </span>
                    </td>

                    {/* Gender */}
                    <td className="px-6 py-5">
                      <span className="text-sm text-[#77736D]">
                        {gender || '—'}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-5">

                      <div>
                        <p className="text-sm text-[#1C1C1C]">
                          {city || '—'}
                        </p>

                        <p className="text-xs text-[#99958E] mt-0.5">
                          {state || street || '—'}
                        </p>
                      </div>

                    </td>

                    {/* Tourist ID */}
                    <td className="px-6 py-5">
                      <span className="text-sm text-[#1C1C1C]">
                        #{touristId}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5 text-right">

                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#99958E] hover:bg-[#F7F5F0] hover:text-[#1C1C1C] transition">
                        <MoreHorizontal size={17} />
                      </button>

                    </td>

                  </tr>
                )
              })}

              {filteredTourists.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-sm text-[#99958E]"
                  >
                    No tourists found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        {/* Bottom */}
        <div className="border-t border-[#E6E1D8] px-6 py-4 flex items-center justify-between">

          <p className="text-xs text-[#99958E]">
            Showing {filteredTourists.length} tourists
          </p>

          <div className="flex items-center gap-2">

            <button className="w-8 h-8 rounded-lg border border-[#E6E1D8] flex items-center justify-center text-[#99958E] hover:bg-[#F7F5F0] transition">
              <ChevronLeft size={15} />
            </button>

            <button className="w-8 h-8 rounded-lg bg-[#1C1C1C] text-white text-xs">
              1
            </button>

            <button className="w-8 h-8 rounded-lg border border-[#E6E1D8] flex items-center justify-center text-[#99958E] hover:bg-[#F7F5F0] transition">
              <ChevronRight size={15} />
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Tourists