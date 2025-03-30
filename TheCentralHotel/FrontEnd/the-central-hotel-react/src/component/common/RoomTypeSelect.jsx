const RoomTypeSelect =({roomTypes, selectedRoomType, onChange})=>{

    return (
        <>
            <label>Room type</label>
            <select value={selectedRoomType} onChange={onChange}>
                <option disable="true" value="">
                    Select Room type
                </option>
                {roomTypes.map((roomType) => (
                    <option key={roomType} value={roomType}>
                        {roomType}
                    </option>

                ))}
            </select>
        </>
    )
}
export default RoomTypeSelect;