import React from 'react'
import { useSearch } from '@/context/search-context'
import { useTheme } from '@/context/theme-context'
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command'
import { ScrollArea } from './ui/scroll-area'
import {useNavigate} from "react-router-dom";
import {sidebarData} from "@/layout/data/sidebar-data.ts";
import {LucideArrowBigRightDash, LucideLuggage, LucideMoon, LucideSun} from "lucide-react";

export function CommandMenu() {
    const navigate = useNavigate()
    const { setTheme } = useTheme()
    const { open, setOpen } = useSearch()

    const runCommand = React.useCallback(
        (command: () => unknown) => {
            setOpen(false)
            command()
        },
        [setOpen]
    )

    return (
        <CommandDialog modal open={open} onOpenChange={setOpen}>
            <CommandInput placeholder='Type a command or search...' />
            <CommandList>
                <ScrollArea type='hover' className='h-72 pr-1'>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {sidebarData.navGroups.map((group) => (
                        <CommandGroup key={group.title} heading={group.title}>
                            {group.items.map((navItem, i) => {
                                if (navItem.url)
                                    return (
                                        <CommandItem
                                            key={`${navItem.url}-${i}`}
                                            value={navItem.title}
                                            onSelect={() => {
                                                runCommand(() => navigate(navItem.url!))
                                            }}
                                        >
                                            <div className='mr-2 flex h-4 w-4 items-center justify-center'>
                                                <LucideArrowBigRightDash className='text-muted-foreground/80 size-2' />
                                            </div>
                                            {navItem.title}
                                        </CommandItem>
                                    )

                                return navItem.items?.filter(subItem => subItem.url).map((subItem, i) => (
                                    <CommandItem
                                        key={`${navItem.title}-${subItem.url}-${i}`}
                                        value={`${navItem.title}-${subItem.url}`}
                                        onSelect={() => {
                                            runCommand(() => navigate(subItem.url!))
                                        }}
                                    >
                                        <div className='mr-2 flex h-4 w-4 items-center justify-center'>
                                            <LucideArrowBigRightDash className='text-muted-foreground/80 size-2' />
                                        </div>
                                        {navItem.title} <LucideLuggage /> {subItem.title}
                                    </CommandItem>
                                ))
                            })}
                        </CommandGroup>
                    ))}
                    <CommandSeparator />
                    <CommandGroup heading='Theme'>
                        <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
                            <LucideSun /> <span>Light</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
                            <LucideMoon className='scale-90' />
                            <span>Dark</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
                            <LucideArrowBigRightDash />
                            <span>System</span>
                        </CommandItem>
                    </CommandGroup>
                </ScrollArea>
            </CommandList>
        </CommandDialog>
    )
}