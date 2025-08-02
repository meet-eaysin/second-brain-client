import React from 'react';
import { Header } from '@/layout/header';
import { TopNav } from '@/layout/top-nav';
import { Main } from '@/layout/main';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { ProfileDropdown } from '@/components/profile-dropdown';

interface ContentLayoutProps {
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    showTopNav?: boolean;
}

const topNav = [
    {
        title: 'Overview',
        href: '/app/dashboard',
        isActive: false,
    },
    {
        title: 'Customers',
        href: '/app/customers',
        isActive: false,
    },
    {
        title: 'Products',
        href: '/app/products',
        isActive: false,
    },
    {
        title: 'Settings',
        href: '/app/settings',
        isActive: false,
    },
];

export function ContentLayout({ 
    title, 
    children, 
    actions,
    showTopNav = false 
}: ContentLayoutProps) {
    return (
        <>
            {/* Header */}
            <Header>
                {showTopNav && <TopNav links={topNav} />}
                <div className='ml-auto flex items-center space-x-4'>
                    <Search />
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>

            {/* Main Content */}
            <Main>
                <div className='mb-6 flex items-center justify-between space-y-2'>
                    <h1 className='text-2xl font-bold tracking-tight'>{title}</h1>
                    {actions && (
                        <div className='flex items-center space-x-2'>
                            {actions}
                        </div>
                    )}
                </div>
                {children}
            </Main>
        </>
    );
}
