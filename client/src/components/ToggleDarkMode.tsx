import { useColorMode } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

import React from 'react'

const ToggleDarkMode = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <div onClick={() => toggleColorMode()} style={{ cursor: "pointer", margin: "0 5px 0 10px" }}>
            {colorMode === 'light' ? <MoonIcon boxSize={5} color="gray.200" /> : <SunIcon boxSize={5} />}
        </div>
    )
}

export default ToggleDarkMode