import Element from './Element';

const Group = (props) => {
    const {
        addOnClass, 
        name, 
        children, 
        ...rest
    } = props;
     
    const groupClass = `flex flex-col gap-1 
    ${addOnClass ? addOnClass : ''} bg-timberwolf 
    text-gunmetal rounded-lg p-1`

    return (
        <div className={groupClass}>
            <div className='flex items-center'>
                <Element {...rest}>
                    <p>{name}</p>
                </Element>

            </div>
            <div className='flex flex-col 
            text-[10px] grow gap-1 pl-4 mb-1'>
                    {children}
            </div>
        </div>
    )
}

export default Group