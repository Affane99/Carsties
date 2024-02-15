'use client'
import { Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { FieldValues, useForm, useController } from 'react-hook-form'
import Input from '../components/Input';
import DateInput from '../components/DateInput';
import { createAuction, updateAuction, uploadImage } from '../actions/auctionActions';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Auction } from '@/types';
import ImageInput from '../components/ImageInput';


type Props = {
    auction?: Auction
}


export default function AuctionForm({ auction }: Props) {
    const {
        handleSubmit,
        setFocus,
        control,
        reset,
        setValue,
        formState: { isSubmitting, isValid }
    } = useForm({
        mode: "onTouched"
    });


    const router = useRouter();
    const pathname = usePathname();
    const [isDisabled,setIsDisabled] = useState(false)

    useEffect(() => {
        if (auction) {
            const { make, model, color, mileage, year, imageUrl } = auction;
            reset({ make, model, color, mileage, year, imageUrl });
        }
        setFocus('make');
    }, [setFocus]);

    async function onImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        const path = event.target.value;
        const formData = new FormData();
        
        formData.append('file', file!,path);
        formData.append('id', auction?.id as string);

        try {
            const res = await uploadImage(formData);

            if (res.error) throw res.error;

            setValue('imageUrl',res.imageUrl,{
                shouldDirty:true,
                shouldValidate:true,
                shouldTouch:true
            });

            setIsDisabled(true);
            toast.success("L'image a été mise à jour avec succès");

        } catch (error:any) {
            toast.error(`${error.status} ${error.message}`);
        }
    }

    async function onSubmit(data: FieldValues) {
        delete data?.file;
        try {
            let id = "";
            let res;
            if (pathname === '/auctions/create') {
                res = await createAuction(data);
                id = res.id;
            } else {
                if (auction) {
                    res = await updateAuction(data, auction.id);
                    id = auction.id;
                }
            }
            if (res.error) {
                throw res.error;
            }
            router.push(`/auctions/details/${id}`);
        } catch (error: any) {
            toast.error(`${error.status} ${error.message}`);
        }
    }

    return (
        <form className="flex flex-col mt-3" onSubmit={handleSubmit(onSubmit)}>
            <Input
                label='Make' name='make'
                control={control} rules={{ required: "Make is required" }}
            />
            <Input
                label='Model' name='model'
                control={control} rules={{ required: "Model is required" }}
            />
            <Input
                label='Color' name='color'
                control={control} rules={{ required: "Color is required" }}
            />

            <div className="grid grid-cols-2 gap-3">
                <Input
                    label='Year' name='year' type='number'
                    control={control} rules={{ required: "Year is required" }}
                />
                <Input
                    label='Mileage' name='mileage' type='number'
                    control={control} rules={{ required: "Mileage is required" }}
                />
            </div>
            {pathname.includes('/auctions/update/')  &&
                <>
                    <div className='grid grid-cols-2 gap-3'>
                        <ImageInput
                            name='file'
                            control={control}
                            onChange={onImageChange}
                        />
                        <Input
                            label='Image URL' name='imageUrl'
                            control={control} 
                            rules={{ required: "Image URL is required" }}
                            disabled = {isDisabled}
                        />
                    </div>
                </>
            }

            {pathname === '/auctions/create' &&
                <>

                    <Input
                        label='Image URL' name='imageUrl'
                        control={control} rules={{ required: "Image URL is required" }}
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label='Reserve price (enter 0 if no reserve)' name='reservePrice' type='number'
                            control={control} rules={{ required: "Reserve price is required" }}
                        />
                        <DateInput
                            label='Auction end date/time'
                            name='auctionEnd'
                            dateFormat='dd MMMM yyyy p'
                            showTimeSelect
                            control={control}
                            rules={{ required: "Auction end date is required" }}
                        />
                    </div>
                </>
            }

            <div className="flex justify-between">
                <Button outline color='gray'>Cancel</Button>
                <Button
                    outline
                    color='success'
                    isProcessing={isSubmitting}
                    disabled={!isValid}
                    type='submit'
                >Submit</Button>
            </div>
        </form>
    )
}
