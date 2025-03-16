import "./Form.css"
import {useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {ZodSchema} from "zod"

interface Field {
	name: string,
	label:string,
	type: "text" | "number" | "password" | "email" 
}

interface FormProps<T> {
	schema: ZodSchema<T>,
	fields: Field[],
	onSubmit: SubmitHandler<T>,
	labelButton: string
}

export default function Form<T>({schema, fields, onSubmit, labelButton} : FormProps<T>) {
	const {register, handleSubmit, formState:{errors, isSubmitting, isSubmitted}} = useForm<T>({resolver: zodResolver(schema)})


	return(
		<form onSubmit={handleSubmit(onSubmit)}>
			{fields.map(field => {
				<div class="field-group">
					<input type="text" {...register(field.name as keyof T)}>
					<label name={field.name}></label>
					{errors[field.name] && <p>{errors[field.name].message}</p>}
				</div>
			})}
			<button type="submit">{labelButton}</button>
		</form>
	)

}

