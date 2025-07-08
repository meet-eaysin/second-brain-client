import { Link, useLocation } from 'react-router-dom'

export const Sidebar = () => {
    const location = useLocation()

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        { name: 'Users', href: '/users', icon: '👥' },
        { name: 'Settings', href: '/settings', icon: '⚙️' },
        { name: 'Reports', href: '/reports', icon: '📈' },
    ]

    return (
        <div className="w-64 bg-white shadow-sm border-r border-gray-200">
            <div className="p-4">
                <nav className="space-y-2">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                location.pathname === item.href
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    )
}
