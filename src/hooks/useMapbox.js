import mapboxgl from 'mapbox-gl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Subject } from 'rxjs'

mapboxgl.accessToken = process.env.REACT_APP_KEY

const coordInitial = { lng: -70.7445, lat: -33.7342, zoom: 14.81 }

export default function useMapbox () {
  const refMapa = useRef()
  const mapa = useRef()
  const markers = useRef({})
  const [coord, setCoord] = useState(coordInitial)

  const newMarker = useRef(new Subject())
  const moveMarker = useRef(new Subject())

  const addMarker = useCallback((event, id) => {
    const { lng, lat } = event.lngLat || event
    const marker = new mapboxgl.Marker()
    marker.id = id ?? uuidv4()

    marker
      .setLngLat([lng, lat])
      .addTo(mapa.current)
      .setDraggable(true)

    if (!id) {
      newMarker.current.next({ id: marker.id, lng, lat })
    }

    markers.current[marker.id] = marker

    marker.on('drag', event => {
      const { id } = event.target
      const { lng, lat } = event.target.getLngLat()
      moveMarker.current.next({ id, lng, lat })
    })
  }, [])

  useEffect(() => {
    mapa.current = new mapboxgl.Map({
      container: refMapa.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [coordInitial.lng, coordInitial.lat],
      zoom: coordInitial.zoom
    })
  }, [])

  useEffect(() => {
    mapa.current?.on('move', () => {
      const { lng, lat } = mapa.current.getCenter()
      setCoord({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: mapa.current.getZoom().toFixed(2)
      })
    })
    return () => mapa.current?.off('move')
  }, [])

  useEffect(() => {
    mapa.current?.on('click', addMarker)
    return () => mapa.current?.off('click')
  }, [addMarker])

  const updateMarker = useCallback(({ id, lng, lat }) => {
    markers.current[id].setLngLat([lng, lat])
  }, [])

  return {
    coord,
    refMapa,
    addMarker,
    newMarker$: newMarker.current,
    moveMarker$: moveMarker.current,
    updateMarker
  }
}
