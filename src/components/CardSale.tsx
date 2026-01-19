const CardSale = () => { 
    return (
        <div className="bg-secondary shadow-md rounded p-2 justify-content-center d-flex flex-column align-items-center m-2">
            <img src="https://via.placeholder.com/150" alt="Product" className="w-full h-32 object-cover rounded-t-lg" />
            <h2 className="text-xl font-bold">Penjualan</h2>
            <p className="text-gray-700">$19.99</p>
            <button className="bg-blue-500 py-2 px-4 rounded">Details</button>
        </div>
    )
}
export default CardSale;