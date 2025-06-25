import { useState } from "react";
import "../styles/Faq.css";

const Faqs = (props) => {
    const [answer, setAnswer] = useState({});

    const answerHandler = (id) => {
        setAnswer((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    return (
        <div className="FaqWrapper">
            
            <div className="FaqContent">
                <h3 className="FaqHeading">Frequently Asked Questions</h3>
                <div className="FaqContainer">
                    {props.Faqdata.map((item) => (
                        <div key={item.id} className="FaqItem">
                            <button 
                                className="FaqQuestion" 
                                onClick={() => answerHandler(item.id)}
                            >
                                {item.question} <span className="arrow">▼</span>
                            </button>
                            {answer[item.id] && <p className="FaqAnswer">{item.answer}</p>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="ImageContainer">
                
            </div>
        </div>
    );
};

export default Faqs;
