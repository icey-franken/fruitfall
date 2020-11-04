import React from 'react';

import MapMain from '../components/Map/MapMain'
import AddLocationForm from '../components/Map/AddLocationForm'

export default function AddLocationView() {
	return (
		<div className='add-location__view'>
			<AddLocationForm/>
			<MapMain addingLocation={true}/>
		</div>
	)
}
