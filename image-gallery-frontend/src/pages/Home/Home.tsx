import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const token = sessionStorage.getItem("token");

  // Theme State - Uses localStorage for persistence
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Apply theme to <html> tag
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://52.66.146.144:5000/api/v1/user/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData(response.data.user);
      } catch (error) {
        console.error(error);
        sessionStorage.removeItem("token");
        window.location.href = "/login";
      }
    };

    if (token) {
      fetchUserData();
    } else {
      window.location.href = "/login";
    }
  }, [token]);

  // Logout Function
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  // Theme Change Handler
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Navbar */}
      <nav className="navbar bg-white shadow-md px-6 py-4 rounded-lg">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">My Memory App</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Theme Switcher */}
          <select
            value={theme}
            onChange={handleThemeChange}
            className="select select-bordered"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="dracula">Dracula</option>
            <option value="night">Night</option>
            <option value="coffee">Coffee</option>
            <option value="luxury">Luxury</option>
          </select>

          <button
            onClick={handleLogout}
            className="btn btn-outline btn-error px-5 py-2 font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className="hero flex flex-col items-center justify-center text-center mt-10 p-8 rounded-lg shadow-lg"
        style={{
          backgroundImage: "url('https://source.unsplash.com/featured/?memories,nature')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-overlay bg-opacity-75 rounded-lg p-8 w-full max-w-lg text-white">
          <h1 className="text-4xl font-bold mb-4">
            Welcome, {sessionStorage.getItem("username")}!
          </h1>
          <p className="mb-6 text-lg">
            Discover and cherish your memories. Share, upload, and relive your
            precious moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/gallery")}
              className="btn btn-primary px-6 py-3 text-lg font-semibold shadow-lg hover:scale-105 transition"
            >
              View Memories
            </button>
            <button
              onClick={() => navigate("/upload")}
              className="btn btn-accent px-6 py-3 text-lg font-semibold shadow-lg hover:scale-105 transition"
            >
              Upload a Memory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
