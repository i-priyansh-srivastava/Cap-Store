import ProductCard from "./ProductCard";
import Nav from "../HomePage/Navbar";
import Footer from "../HomePage/Footer";
import "../../styles/ProductPage.css";

const ProductPage = (props) => {
  return (
    <div>
      <Nav setLogin={props.setLogin}></Nav>
      <section className="productPage">
        <h1 className="shopHead">Products</h1>
        <ProductCard></ProductCard>
      </section>
      <Footer></Footer>
    </div>
  );
}

export default ProductPage;