import EarlyAccessCard from "./EarlyAccessCard";
import Nav from "../HomePage/Navbar";
import Footer from "../HomePage/Footer";
import "../../styles/EarlyAccess.css";

const EarlyAccessPage = (props) => {
  return (
    <div>
      <div className='emptySpace'></div>
      <Nav setLogin={props.setLogin}></Nav>
      <section className="earlyAccessPage">
        <EarlyAccessCard></EarlyAccessCard>
      </section>
      <Footer></Footer>
    </div>
  );
}

export default EarlyAccessPage; 