import { useLoadScript } from '@react-google-maps/api'

// Include all libraries needed across the app
const libraries = ['places', 'geometry', 'geocoding']

export function useGoogleMaps() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
    preventGoogleFontsLoading: true,
    id: 'google-map-script',
  })

  return { isLoaded, loadError }
}