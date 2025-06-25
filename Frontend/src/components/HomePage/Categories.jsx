import '../../styles/Categories.css';

const categories = [
  {
    title: 'Mens Wear',
    image:
      'https://images.pexels.com/photos/14705364/pexels-photo-14705364.jpeg',
  },
  {
    title: 'Womens Wear',
    image:
      'https://images.pexels.com/photos/7679729/pexels-photo-7679729.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Kids Wear',
    image:
      'https://images.pexels.com/photos/28725300/pexels-photo-28725300.jpeg',
  },
  {
    title: 'Accessories',
    image:
      'https://images.pexels.com/photos/8474063/pexels-photo-8474063.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Sports',
    image:
      'https://images.unsplash.com/photo-1611132179879-d7272621e424?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const Categories = () => {
  return (
    <section className="categories-section">
      <h2 className="heading">Our Categories</h2>
      <p className="subheading">
        Explore a wide range of styles, handpicked to suit every taste and need.
      </p>
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div className="category-card" key={index}>
            <img src={category.image} alt={category.title} className="category-img" />
            <div className="category-info">
              <h3>{category.title}</h3>
              <span>Shop Now</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
