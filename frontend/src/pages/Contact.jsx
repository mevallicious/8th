import Navbar from "../components/Navbar";
import CurvedLoop from "../components/CurvedLoop";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import "../styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      <Navbar />

      {/* TOP CURVED LOOP */}
      <div className="curved-nav top-loop">
        <CurvedLoop
          marqueeText="Energy ✦ Ideas ✦ Execution ✦ Growth ✦"
          speed={2}
          curveAmount={-6}
          direction="left"
          draggable={false}
        />
      </div>

      {/* MAIN SECTION */}
      <section className="contact-section">
        <div className="contact-container">

          {/* LEFT – FORM */}
          <div className="contact-form">
            <p className="contact-label">CONTACT</p>

            <h1 className="contact-heading">
              LET’S CREATE <br /> SOMETHING MEANINGFUL
            </h1>

            <form className="form-grid">
              <input placeholder="First Name" />
              <input placeholder="Last Name" />
              <input placeholder="Email" />
              <input placeholder="Phone" />
              <input className="full" placeholder="Subject" />
              <textarea rows="4" className="full" placeholder="Message" />

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>

          {/* RIGHT – INFO CARD */}
          <div className="contact-info">
            <h2>Get in Touch</h2>

            <div className="info-block">
              <h3>Address</h3>
              <p>
                1 Monster Way <br />
                Corona, CA 92879
              </p>
            </div>

            <div className="info-block">
              <h3>Phone</h3>
              <p>+1 866-322-4466</p>
            </div>

            <div className="info-block">
              <h3>Email</h3>
              <p>contact@yourbrand.com</p>
            </div>

            <div className="info-block">
              <h3>Social</h3>
              <div className="socials">
                <FaFacebookF />
                <FaInstagram />
                <FaLinkedinIn />
                <FaYoutube />
              </div>
            </div>

            <div className="decor-circle" />
          </div>
        </div>
      </section>

      {/* BOTTOM CURVED LOOP */}
      <div className="curved-nav bottom-loop">
        <CurvedLoop
          marqueeText="Create ✦ Connect ✦ Collaborate ✦ Build ✦ Together ✦"
          speed={2}
          curveAmount={-6}
          direction="right"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default Contact;
