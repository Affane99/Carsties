import { Label } from 'flowbite-react'
import React from 'react'
import { UseControllerProps, useController } from 'react-hook-form'
import 'react-datepicker/dist/react-datepicker.css'
import Datepicker, { ReactDatePickerProps } from 'react-datepicker'
import { format } from 'date-fns';
import frLocale from 'date-fns/locale/fr';

type Props = {
    label: string
    type?: string
    showLabel?: boolean
} & UseControllerProps & Partial<ReactDatePickerProps>


export default function DateInput(props: Props) {
    const { field, fieldState } = useController({ ...props, defaultValue: "" });

    return (
        <div className='block'>
            {props.showLabel && (
                <div className="mb-2 block">
                    <Label htmlFor={field.name} value={props.label} />
                </div>
            )}
            <Datepicker
                {...props}
                {...field}
                onChange={value => field.onChange(value)}
                selected={field.value}
                placeholderText={props.label}
                locale={frLocale}
                className={`
                    rounded-lg w-[100%] flex flex-col
                    ${fieldState.error
                        ? 'bg-red-50 border-red-500 text-red-500'
                        : (!fieldState.invalid && fieldState.isDirty)
                            ? 'bg-green-50 border-green-500 text-green-900' : ''
                    }
                `}
            />
            {fieldState.error &&(
                <div className="text-red-500 text-sm">{ fieldState.error.message }</div>
            )}
        </div>
    )
}
