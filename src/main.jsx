import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './Components/Styles/globlas.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import "antd/dist/reset.css";
import i18n from "./i18n";
import { I18nextProvider } from 'react-i18next'
import { store, persistor } from './Components/Redux/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <PersistGate
          loading={null}
          persistor={persistor}
        >
          <App />
        </PersistGate>
      </I18nextProvider>
    </Provider>
  </StrictMode>,
)
