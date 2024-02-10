"use client"

import { deleteAuction } from '@/app/actions/auctionActions';
import { Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

type Props = {
    id:string;
}

export default function DeleteButton({id}:Props) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    function del(){
        setLoading(true);
        deleteAuction(id)
        .then((res) =>{
            if(res.error){
                throw res.error
            }
            router.push('/');
        }).catch((err)=>{
            toast.error(`${err.status} ${err.message}`);
        }).finally(() => setLoading(false));
    }

  return (
    <Button color='failure' outline isProcessing={loading} onClick={del} >
        Delete Auction
    </Button>
  )
}
