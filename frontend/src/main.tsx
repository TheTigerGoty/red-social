import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import { ColorModeScript, StyleFunctionProps, extendTheme } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'

//!---------------------------------------------------------------------------------!//

const styles = {
  global: (props: StyleFunctionProps) => ({
    color: mode('gray.800', 'whiteAlpha.900')(props),
    bg: mode('gray.100', '#101010')(props),
  })
};

//*---------------------------------------------------------------------------------*//

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true
};

//*---------------------------------------------------------------------------------*//

const colors = {
  gray: {
    light: '#616161',
    dark: '#1e1e1e'
  }
}

//*---------------------------------------------------------------------------------*//

const theme = extendTheme({ config, styles, colors });

//!---------------------------------------------------------------------------------!//

// TODO: <BrowserRouter> : Habilitar Navegacion

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
