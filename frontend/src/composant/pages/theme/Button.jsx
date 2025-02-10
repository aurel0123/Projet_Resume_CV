
function Button({children , theme, className , href} ) {
    const baseClasse = 'text-white hover:text-white' ; 
    const themeClass = 
        theme === 'primary' ? 
            'bg-[#4361ee] hover:bg-[#3b4cc0]' :
            theme === 'secondary' ?
                'bg-transparent hover:bg-[#4361ee]' : 
                    "" 
    const renderButton = () => {
        return(
            <button className={`btn btn-md  ${themeClass} ${className} ${baseClasse} `}>{children}</button>
        )
    }
    const renderLink = () => (
        <a href={href} 
            className={`btn btn-md rounded-lg ${themeClass} ${className}  border-2 no-underline` }>
            {children}
        </a>
    )
    return href ? renderLink() : renderButton() 
}

export default Button