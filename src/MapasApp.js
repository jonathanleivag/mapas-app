import MapaPage from './pages/MapaPage'
import store from './redux/store'
import { Provider } from 'react-redux'

export default function MapasApp () {
  return (
    <Provider store={store}>
      <MapaPage />
    </Provider>
  )
}
