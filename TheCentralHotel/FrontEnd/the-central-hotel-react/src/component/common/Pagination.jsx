const Pagination = ({roomsPerPage, totalRooms, currentPage, paginate}) => {
    
    
    const pageNumbers = [];
    for (let i = 1; i<= Math.ceil(totalRooms/roomsPerPage);i++){ 
        pageNumbers.push(i)
    }    
    return ( 
        <div className="pagination-nav">
            <div className="pagination-ul">
                {
                    pageNumbers.map( number=> (
                        <li key={number} className="pagination-li">
                            {/* activa o desactiva el boton condicionalmente */}
                        <button onClick={()=>paginate(number)} 
                        className={`pagination-button ${currentPage === number? 'current-page' : ''}`}>
                        {number}

                        </button>
                        </li>
                    )
                    )
                }
            </div>
            
        </div>
     );
}

export default Pagination;