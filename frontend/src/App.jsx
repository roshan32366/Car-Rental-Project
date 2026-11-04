
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000/api";

function App() {
  const [cars, setCars] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [authMode, setAuthMode] = useState("");
  const [bookingCar, setBookingCar] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [dates, setDates] = useState({
    pickupDate: "",
    returnDate: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API}/cars`)
      .then((res) => setCars(res.data.cars || []))
      .catch(() => setMessage("Unable to load cars. Check backend."));
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  // LOGIN AND REGISTER
  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage("");

    if (loading) return;

    if (authMode === "register") {
      if (form.password !== form.confirmPassword) {
        setMessage("Passwords do not match!");
        return;
      }

      if (form.password.length < 6) {
        setMessage("Password must contain at least 6 characters.");
        return;
      }
    }

    setLoading(true);

    try {
      if (authMode === "register") {
        await axios.post(`${API}/auth/register`, {
          name: form.name,
          email: form.email,
          password: form.password,
        });

        setMessage("Account created successfully! Please login.");

        setAuthMode("login");
        setForm({
          name: "",
          email: form.email,
          password: "",
          confirmPassword: "",
        });

        return;
      }

      const response = await axios.post(`${API}/auth/login`, {
        email: form.email,
        password: form.password,
      });

      const newToken = response.data.token;

      localStorage.setItem("token", newToken);
      setToken(newToken);

      setAuthMode("");
      resetForm();
      setMessage("Login successful! You can now book a car.");

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Authentication failed. Check backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // BOOKING
  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (dates.returnDate <= dates.pickupDate) {
        setMessage("Return date must be after pickup date.");
        return;
      }

      const response = await axios.post(
        `${API}/bookings`,
        {
          carId: bookingCar._id,
          pickupDate: dates.pickupDate,
          returnDate: dates.returnDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        `Booking successful! Total price: ₹${response.data.booking.totalPrice}`
      );

      setBookingCar(null);
      setDates({ pickupDate: "", returnDate: "" });

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Booking failed. Please try again."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setMessage("Logged out successfully.");
  };

  const openAuth = (mode) => {
    resetForm();
    setAuthMode(mode);
    setMessage("");
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <h2>CarRental</h2>

        <div>
          <a href="/">Home</a>
          <a href="#cars">Cars</a>
          <a href="#about">About</a>

          {token ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <button onClick={() => openAuth("login")}>Login</button>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <h1>Find Your Perfect Ride</h1>
        <p>Book your favourite car at an affordable price.</p>
        <a href="#cars" className="btn">Explore Cars</a>
      </section>

      {message && <p className="message">{message}</p>}

      {/* CARS */}
      <section id="cars" className="cars-section">
        <h2>Available Cars</h2>

        <div className="car-list">
          {cars.map((car) => (
            <div className="car-card" key={car._id}>
              <img
                src={car.image || "https://placehold.co/600x350?text=Car"}
                alt={car.name}
              />

              <h3>{car.name}</h3>
              <p>{car.brand}</p>
              <h4>₹{car.pricePerDay} / day</h4>

              <button onClick={() => {
                if (!token) {
                  openAuth("login");
                  setMessage("Please login before booking.");
                } else {
                  setBookingCar(car);
                  setMessage("");
                }
              }}>
                Book Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* LOGIN AND REGISTER */}
      {authMode && (
        <div className="modal">
          <form className="modal-content" onSubmit={handleAuth}>
            <h2>
              {authMode === "login" ? "Welcome Back!" : "Create Your Account"}
            </h2>

            <p>
              {authMode === "login"
                ? "Login to book your favourite car."
                : "Register to start your journey with us."}
            </p>

            {authMode === "register" && (
              <input
                type="text"
                placeholder="Full Name"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            )}

            <input
              type="email"
              placeholder="Email Address"
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            {authMode === "register" && (
              <input
                type="password"
                placeholder="Confirm Password"
                required
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
            )}

            <button type="submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : authMode === "login"
                ? "Login"
                : "Create Account"}
            </button>

            <p>
              {authMode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                type="button"
                onClick={() =>
                  openAuth(authMode === "login" ? "register" : "login")
                }
              >
                {authMode === "login" ? "Register" : "Login"}
              </button>
            </p>

            <button
              type="button"
              onClick={() => setAuthMode("")}
            >
              Close
            </button>
          </form>
        </div>
      )}

      {/* BOOKING */}
      {bookingCar && (
        <div className="modal">
          <form className="modal-content" onSubmit={handleBooking}>
            <h2>Book {bookingCar.name}</h2>

            <p>Price: ₹{bookingCar.pricePerDay} per day</p>

            <label>Pickup Date</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              value={dates.pickupDate}
              onChange={(e) =>
                setDates({ ...dates, pickupDate: e.target.value })
              }
            />

            <label>Return Date</label>
            <input
              type="date"
              required
              min={dates.pickupDate || new Date().toISOString().split("T")[0]}
              value={dates.returnDate}
              onChange={(e) =>
                setDates({ ...dates, returnDate: e.target.value })
              }
            />

            <button type="submit">Confirm Booking</button>

            <button
              type="button"
              onClick={() => setBookingCar(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* FOOTER */}
      <footer id="about">
        <p>© 2026 CarRental. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
