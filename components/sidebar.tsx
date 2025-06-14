import Link from "next/link"

type PageName = "food" | "staff" | "history" | "settings"

interface SidebarProps {
  activePage: PageName
}

export function Sidebar({ activePage }: SidebarProps) {
  return (
    <div className="w-64 bg-[#2D1B69] text-white flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">CN</span>
        </div>
        <span className="font-medium text-lg">Coffee Niko</span>
      </div>

      <nav className="flex-1 px-4 py-2">
        <div
          className={`py-3 px-4 rounded-md mb-2 transition-colors ${activePage === "food" ? "bg-[#3D2A7D]" : "hover:bg-[#3D2A7D]"}`}
        >
          <Link href="/" className="block font-medium">
            Food Price Management
          </Link>
        </div>
        <div
          className={`py-3 px-4 rounded-md mb-2 transition-colors ${activePage === "staff" ? "bg-[#3D2A7D]" : "hover:bg-[#3D2A7D]"}`}
        >
          <Link href="/staff" className="block font-medium">
            Staff management
          </Link>
        </div>
        <div
          className={`py-3 px-4 rounded-md mb-2 transition-colors ${activePage === "history" ? "bg-[#3D2A7D]" : "hover:bg-[#3D2A7D]"}`}
        >
          <Link href="/history" className="block font-medium">
            History Order
          </Link>
        </div>
        <div
          className={`py-3 px-4 rounded-md mb-2 transition-colors ${activePage === "settings" ? "bg-[#3D2A7D]" : "hover:bg-[#3D2A7D]"}`}
        >
          <Link href="/settings" className="block font-medium">
            Settings
          </Link>
        </div>
      </nav>

      <div className="p-4 mt-auto">
        <button className="block font-medium py-3 px-4 w-full text-left hover:bg-[#3D2A7D] rounded-md transition-colors">
          Logout
        </button>
      </div>
    </div>
  )
}
