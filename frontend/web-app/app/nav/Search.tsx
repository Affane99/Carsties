'use client'

import { useParamsStore } from '@/hooks/useParamsStore'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

export default function Search() {
    const router = useRouter();
    const pathname = usePathname();
    const setParams = useParamsStore(state => state.setParams);
    const setSearchValue = useParamsStore(state => state.setSearchValue);
    const searchValue = useParamsStore(s => s.searchValue);

    function onChange(event: any) {
        setSearchValue(event.target.value);
    }

    function search() {
        if(pathname !== '/') router.push('/');
        setParams({ searchTerm: searchValue });
    }

    return (
        <div className='flex w-[50%] items-center rounded-full border-2 py-2 shadow-sm'>
            <input
                onKeyDown={(e) => {
                    if (e.key === 'Enter') search();
                }}
                onChange={onChange}
                value={searchValue}
                type="text"
                placeholder='Search for cars by make, color or model'
                className='
                    flex-grow
                    pl-5
                    bg-transparent
                    border-none
                    focus:outline-none
                    focus:border-none
                    focus:ring-0
                    text-sm
                    text-gray-600
                '
            />
            <button onClick={search}>
                <FaSearch
                    size={34}
                    className='bg-red-500 text-white rounded-full p-2 cursor-pointer mx-2'
                />
            </button>
        </div>
    )
}
