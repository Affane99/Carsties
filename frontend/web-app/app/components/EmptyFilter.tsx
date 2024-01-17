import { useParamsStore } from '@/hooks/useParamsStore'
import React from 'react'
import Heading from './Heading'
import { Button } from 'flowbite-react'

type Props = {
    title?: string
    subtitle?: string
    showResetButton?: boolean
}

export default function EmptyFilter({
    showResetButton,
    subtitle = "Try changing or resetting the filter",
    title = "No matches for this filter"
}: Props) {
    const reset = useParamsStore(s => s.reset);

    return (
        <div
            className='h-[40vh] flex flex-col gap-2 justify-center items-center shadow-lg'
        >
            <Heading subtitle={subtitle} title={title} center />
            {
                showResetButton ?
                    <div className='mt-4'>
                        <Button outline onClick={reset}>Remove filters</Button>
                    </div> : null
            }
        </div>
    )
}
