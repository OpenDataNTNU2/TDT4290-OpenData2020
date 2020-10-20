import '../styles/globals.css'
import Header from '../Components/Header'

// This will always render everything, so we can have the header (with the navbar here)
function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Header {...pageProps} />
      <Component {...pageProps}  />
    </div>
    
  )
}

export default MyApp
