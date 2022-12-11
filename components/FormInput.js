export const FormInput = (props) => {
    const { id, onChange, ...inputProps } = props
    
    return (
        <>
            <div className="mt-4">
                <label className="capitalize">{props.label}: </label>
                <input {...inputProps} className="border-[1px] border-black rounded w-full" autoComplete="off" onChange={onChange}></input>
            </div>
        </>
    )
}