import Link from "next/link"

interface NavItem {
  title: string
  href: string
  active?: boolean
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="flex-1 px-4 py-2">
      {items.map((item, index) => (
        <div
          key={index}
          className={`py-3 px-4 rounded-md mb-2 transition-colors ${
            item.active ? "bg-[#3D2A7D]" : "hover:bg-[#3D2A7D]"
          }`}
        >
          <Link href={item.href} className="block font-medium">
            {item.title}
          </Link>
        </div>
      ))}
    </nav>
  )
}
