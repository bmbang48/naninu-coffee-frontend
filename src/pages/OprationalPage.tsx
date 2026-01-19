import CardSale from "../components/CardSale";
const OprationalPage = () => {
  return (
    <div className="container-fluid">
      <div className="d-flex flex-wrap justify-content-center container">
      <CardSale/>
      <CardSale/>
      <CardSale/>
      <CardSale/>
      </div>
      <div className="container px-5">
        <div className=" px-5">
          <div className="card-head justify-content-center d-flex py-5">
            <img src="https://live.staticflickr.com/65535/48917809867_0f324a5e5a_o_d.jpg" alt="Grafik" style={{width: '50vw'}}/>
          </div>
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="#" className="btn btn-primary">Go somewhere</a>
          </div>
        </div>
      </div>
    </div>
  );
}
export default OprationalPage;