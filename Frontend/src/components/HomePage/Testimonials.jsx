import '../../styles/Testimonials.css'; 

const testimonials = [
  {
    text: `“Velora has completely transformed how I shop for clothes. Every piece feels thoughtfully designed and incredibly comfortable — from their polos to their jackets. It's rare to find a brand that gets the fit, style, and quality right every single time.”`,
    name: 'Jessica M. San Diego',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    text: `“I'm always looking for clean, versatile styles I can wear to work or on the weekends — and Velora delivers. I picked up a few items from their Men’s collection and was blown away by the craftsmanship. The trousers, especially, have become my go-to.”`,
    name: 'Darren L. New York',
    image: 'https://randomuser.me/api/portraits/men/44.jpg',
  },
  {
    text: `“Shopping for myself and my daughter usually means bouncing between stores, but Velora made it easy. I loved the quality of the dresses I ordered, and my daughter adored her Mini Mode pieces. Stylish, comfortable, and built to last — we’re both fans for life!”`,
    name: 'Michelle T. Chicago',
    image: 'https://randomuser.me/api/portraits/women/47.jpg',
  },
];

const howItWorks = [
  {
    icon: '🛍️',
    title: 'Shop Styles',
    desc: 'Browse our curated collections for Men, Women, Kids & Accessories.',
  },
  {
    icon: '📏',
    title: 'Pick Your Fit',
    desc: 'Find your perfect size with our detailed fit guides and style notes for every piece.',
  },
  {
    icon: '⚡',
    title: 'Checkout Fast',
    desc: 'Enjoy a quick and secure checkout experience with flexible payment options.',
  },
];

const Testimonials = () => {
  return (
    <>
      <section className="testimonials">
        <h2 className="heading">What Our Shoppers Say</h2>
        <p className="subheading">Store that nails fashion and comfort.</p>
        <div className="testimonial-cards">
          {testimonials.map((item, index) => (
            <div className="testimonial-card" key={index}>
              <div className="quote">❝</div>
              <p className="text"> {item.text}</p>
              <div className="user-info">
                <img src={item.image} alt={item.name} />
                <strong>{item.name}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="heading">How It Works</h2>
        <p className="subheading">Just Pick, Pack and Ship</p>
        <div className="how-cards">
          {howItWorks.map((item, index) => (
            <div className="how-card" key={index}>
              <div className="icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Testimonials;
