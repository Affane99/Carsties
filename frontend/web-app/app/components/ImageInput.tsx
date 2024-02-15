import { FileInput, Label } from 'flowbite-react';
import { UseControllerProps, useController } from 'react-hook-form';

type Props = {
    label?: string
    showLabel?: boolean
    multipe?:boolean
    onChange?: (file: React.ChangeEvent<HTMLInputElement>) => void
} & UseControllerProps;

export default function ImageInput(props: Props) {
    const { field, fieldState } = useController({ ...props, defaultValue: "" });

    const extensions = ['.jpeg', '.jpg','.png','.gif'];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (props.onChange && file) {
            props.onChange(event);
        }
        field.onChange(event.target.value);
    };

    return (
        <div id="fileUpload" className="max-w-md">
            {props.showLabel && (
                <div className="mb-2 block">
                    <Label htmlFor={field.name} value={props.label} />
                </div>
            )}
            <FileInput
                {...props}
                {...field}
                placeholder={props.label}
                accept={extensions.join(',')}
                color={fieldState.error ? 'failure' : !fieldState.isDirty ? '' : 'success'}
                helperText={fieldState.error?.message}
                multiple={props.multipe} 
                onChange={handleFileChange}
            />
        </div>
    );
}
