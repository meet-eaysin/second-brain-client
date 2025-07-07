import { Button } from '@/components/ui/button'
import { useTasks } from '../context/tasks-context'
import {LucideDownload, LucidePlus} from "lucide-react";

export function TasksPrimaryButtons() {
    const { setOpen } = useTasks()
    return (
        <div className='flex gap-2'>
            <Button
                variant='outline'
                className='space-x-1'
                onClick={() => setOpen('import')}
            >
                <span>Import</span> <LucideDownload size={18} />
            </Button>
            <Button className='space-x-1' onClick={() => setOpen('create')}>
                <span>Create</span> <LucidePlus size={18} />
            </Button>
        </div>
    )
}