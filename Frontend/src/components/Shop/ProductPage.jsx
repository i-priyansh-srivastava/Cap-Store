import ProductCard from "./ProductCard";
import Nav from "../HomePage/Navbar";
import Footer from "../HomePage/Footer";
import "../../styles/ProductPage.css";

const ProductPage = (props) => {
  return (

    <div>
      <div className='emptySpace'></div>

      <Nav setLogin={props.setLogin}></Nav>
      <section className="productPage">
        <ProductCard></ProductCard>
      </section>
      <Footer></Footer>
    </div>
  );
}

export default ProductPage;