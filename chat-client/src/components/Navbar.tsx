import React, { FunctionComponent, useState } from 'react'

type NavbarProps = {
    title: string
}

type NavbarState = {
    clicked: boolean
}

const Navbar: FunctionComponent<NavbarProps> = ({ title }) => {
    const [state, setState] = useState<NavbarState>({ clicked: false })
    return (
        <div>
            {title}
        </div>
    )
}
export default Navbar