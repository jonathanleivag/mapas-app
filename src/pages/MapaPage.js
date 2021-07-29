import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import useMapbox from '../hooks/useMapbox'

export default function MapaPage () {
  const {
    coord,
    refMapa,
    newMarker$,
    moveMarker$,
    addMarker,
    updateMarker
  } = useMapbox()
  const { socket } = useSelector(state => state.socket)

  useEffect(() => {
    socket.on('marker-activo', markers => {
      for (const key of Object.keys(markers)) {
        addMarker(markers[key], key)
      }
    })
    return () => socket.disconnect()
  }, [socket, addMarker])

  useEffect(() => {
    newMarker$.subscribe(marker => {
      socket.emit('new-marker', marker)
    })
  }, [newMarker$, socket])

  useEffect(() => {
    moveMarker$.subscribe(moveMarker => {
      //   console.log(moveMarker)
      socket.emit('update-marker', moveMarker)
    })
  }, [moveMarker$, socket])

  useEffect(() => {
    socket.on('update-marker', marker => {
      updateMarker(marker)
    })
    return () => socket.disconnect()
  }, [socket, updateMarker])

  useEffect(() => {
    socket.on('new-marker', marker => {
      addMarker(marker, marker.id)
    })
    return () => socket.disconnect()
  }, [socket, addMarker])

  return (
    <>
      <div className='info'>{`Lng: ${coord.lng} | Lat: ${coord.lat} | Zoom: ${coord.zoom}`}</div>
      <div ref={refMapa} className='map-container' />
    </>
  )
}
