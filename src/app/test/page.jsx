import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoMdSettings } from "react-icons/io";
import "./App.css";

const ServerUrl = 'http://127.0.0.1:7000'
function App() {
  const [cameraStatus, setCameraStatus] = useState("connected");
  const [connectionStatus, setConnectionStatus] = useState("connected");
  const [imageSrc, setImageSrc] = useState("/images/sample.jpg");
  const [autoCodes, setAutoCodes] = useState(["MAT3", "MAT2", "MAT1"]);
  const [manualCodes, setManualCodes] = useState(["MAT3", "MAT2", "MAT1"]);
  const hiddenInputRef = useRef(null);
  const [mode, setMode] = useState("auto");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    heading:"",
    ip_address: "",
    auto_register: "",
    manual_register: "",
    connection_register: "",
    mode_register: "",
  });
  
  const storedPassword = "admin2612";

const [currentTime, setCurrentTime] = useState(new Date());

// 🕒 NEW: update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // update every second
    return () => clearInterval(timer);
  }, []);


  // for frames and last codes
  useEffect(() => {
    let ws;
    
    const connectWebSocket = () => {
      // Establish a WebSocket connection
      ws = new WebSocket("ws://127.0.0.1:8001");
      
      // Handle the WebSocket connection opening
      ws.onopen = () => {
        console.log("WebSocket connection established.");
      };
  
      // Handle incoming messages
      ws.onmessage = (event) => {
        //console.log("Message received:", event.data); 
        try {
          const data = JSON.parse(event.data);
          const { frame, last_scanned_barcodes, manual_barcodes } = data;
  
          // Update the image source with the latest frame
          const imageUrl = `data:image/jpg;base64,${frame}`;
          setImageSrc(imageUrl);
  
          // Update barcode lists
          setAutoCodes([...last_scanned_barcodes].reverse());
          setManualCodes([...manual_barcodes].reverse());
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
  
      // Handle WebSocket errors
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
  
      // Handle WebSocket closure
      ws.onclose = (event) => {
        console.log("WebSocket connection closed. Reconnecting...");
        // Attempt to reconnect after a delay
        setTimeout(connectWebSocket, 5000);
      };
    };
  
    connectWebSocket();
  
    // Clean up WebSocket connection on component unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  // for cam and con status
  useEffect(() => {
    // Polling for camera status
    const fetchCameraStatus = async () => {
      try {
        const response = await axios.get(`${ServerUrl}/camera_status`);
        // console.log("camera status data:", response.data.camera_status);
        setCameraStatus(response.data.camera_status);
      } catch (error) {
        console.error("Error fetching camera status:", error);
      }
    };

    // Polling for connection status
    const fetchConnectionStatus = async () => {
      try {
        const response = await axios.get(`${ServerUrl}/connection_status`);
        // console.log("connection status data:", response.data);
        setConnectionStatus(response.data.connection_status );
      } catch (error) {
        // console.error("Error fetching connection status:", error);
      }
    };

    // Set intervals for polling
    const cameraInterval = setInterval(fetchCameraStatus, 3000);
    const connectionInterval = setInterval(fetchConnectionStatus, 2000);

    // Clean up intervals on unmount
    return () => {
      clearInterval(cameraInterval);
      clearInterval(connectionInterval);
    };
  }, []);


  const handleModeToggle = async () => {
    const newMode = mode === "auto" ? "manual" : "auto";
    const manualFlag = newMode === "auto" ? false : true;
    setMode(newMode);

    try {
      const response = await axios.post(`${ServerUrl}/set_manual_flag`, {
        manual_flag: manualFlag,
      });

      if (response.status === 200) {
        console.log(`Mode successfully changed to ${newMode}`);
      } else {
        console.error("Failed to change mode");
      }
    } catch (error) {
      console.error("Error toggling mode:", error);
    }
  };

  useEffect(() => {
    // Keep the hidden input focused
    const focusInput = () => hiddenInputRef.current?.focus();
    focusInput();
    document.addEventListener("click", focusInput);

    return () => {
      document.removeEventListener("click", focusInput);
    };
  }, []);

  const handleKeyPress = async (event) => {
    if (event.key === "Enter") {
      const inputValue = event.target.value;
      event.target.value = "";
      console.log("inputValue", inputValue);
      try {
        const response = await axios.post(`${ServerUrl}/manual_input`, {
          barcode: inputValue,
        });
       
        if (response.status === 200) {
          console.log("Input submitted successfully");
          
          // event.target.value = ""; // Clear input after submission
        } else {
          console.error("Failed to submit input");
        }
      } catch (error) {
        console.error("Error submitting input:", error);
      }
    }
  };

  // modal logic //////////////////////////////////////

  const togglePasswordModal = () => {
    setPasswordModalOpen(!isPasswordModalOpen);
    setError("");
    setPassword("");
  };
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log("Form Data:", formData);
    try {
      const response = await axios.post(`${ServerUrl}/set_settings`, formData);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
    toggleModal(); // Close modal on submit
  };
    // Fetch settings from the API and update the formData state
const fetchSettings = async () => {
  try {
    const response = await axios.get(`${ServerUrl}/get_settings`);
    console.log('Settings fetched:', response.data);

    // Set the form data with the response data
    setFormData({
      heading:response.data.settings.heading ? response.data.settings.heading:'Trim Line Barcode Scanner',
      ip_address: response.data.settings.ip_address,
      auto_register: response.data.settings.auto_register,
      manual_register: response.data.settings.manual_register,
      connection_register: response.data.settings.connection_register,
      mode_register: response.data.settings.mode_register,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
  }
};
const handlePasswordSubmit = () => {
  if (password === storedPassword) {
    togglePasswordModal();
    toggleModal();
  } else {
    setError("Incorrect password. Please try again.");
  }
};
// Call fetchSettings when the modal opens
useEffect(() => {

    fetchSettings();
  
}, [isModalOpen]);
  
  ///////////////////////////////////////////////////

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gray-100">
    <input
        ref={hiddenInputRef}
        type="text"
        onKeyDown={handleKeyPress}
        className="absolute opacity-0 pointer-events-none"
      />
      {/* Logo and Heading */}
      <div className="w-full flex items-center px-4 py-2 bg-white shadow h-[10vh] max-h-[4rem]">
        <img src="/images/logo.png" alt="Logo" className="h-12 w-auto" />
        <h1 className="ml-4 text-3xl font-bold flex-1 text-center">
          {formData.heading}
        </h1>
         {/* 🕒 Clock */}
        <div className='mr-20'>
          <span className="text-xl font-mono mr-4">
            {currentTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })}
          </span>
          <span className="text-xl font-mono">
            {currentTime.toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className='w-full text-left'>
        <h2 className='text-3xl font-semibold'>Current Mode : {mode}</h2>
      </div>

      {/* Image and Text Rows */}
      <div className="flex flex-col md:flex-row w-full flex-1 items-center p-2 h-[75vh]">
        {/* Left: Image */}
        <div className="md:w-1/2 p-4 ">
          <img
            src={imageSrc}
            alt="Placeholder"
            className="w-full h-auto rounded max-h-[65vh] object-contain " 
          />
        </div>

        {/* Right: Text Rows */}
        <div className="md:w-1/2 px-4 space-y-4">
          {/* Auto */}
          <div className="p-4 space-y-4">
            <div className="flex flex-row gap-4">
              <p className="text-4xl font-bold">AUTO :</p>
              <p className="text-4xl font-bold underline">{autoCodes[0]}</p>
            </div>
            <div className="flex flex-row gap-4">
              <p className="text-3xl ">AUTO (Last) :</p>
              <p className="text-3xl">{autoCodes[1]}</p>
            </div>
            <div className="flex flex-row gap-4">
              <p className="text-2xl">AUTO (Second Last) :</p>
              <p className="text-2xl">{autoCodes[2]}</p>
            </div>
          </div>
          {/* Button for auto/manual */}
          <div className="flex flex-row gap-4 p-4 justify-start items-center">
  <p className="text-xl">AUTO/MANUAL :</p>
  <button
    className={`text-xl px-4 py-2 text-white ${
      mode === "auto" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
    }`}
    onClick={handleModeToggle}
  >
    {mode === "auto" ? "Switch to Manual" : "Switch to Auto"}
  </button>
</div>

          {/* Manual */}
          <div className="p-4 space-y-4">
            <div className="flex flex-row gap-4">
              <p className="text-4xl font-bold">MANUAL :</p>
              <p className="text-4xl font-bold underline">{manualCodes[0]}</p>
            </div>
            <div className="flex flex-row gap-4">
              <p className="text-3xl ">MANUAL (Last) :</p>
              <p className="text-3xl ">{manualCodes[1]}</p>
            </div>
            <div className="flex flex-row gap-4">
              <p className="text-2xl">MANUAL (Second Last) :</p>
              <p className="text-2xl">{manualCodes[2]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Blinking Indicators */}
      <div className="w-full h-[15vh] max-h-[150px] flex flex-row gap-8 items-center justify-between max-w-screen-md p-4 bg-black text-white">
        <div className="flex items-center justify-center">
          <p className="text-3xl mr-4">Camera Status:</p>
          <span
            className={`h-8 w-8 rounded-full ${
              cameraStatus === "connected" ? "bg-green-600 animate-pulse" : "bg-red-500"
            } `}
          ></span>
        </div>
        <div className="flex items-center justify-center">
          <p className="text-3xl mr-4">PLC Connection Status:</p>
          <span
            className={`h-8 w-8 rounded-full ${
              connectionStatus === "connected" ? "bg-green-500 animate-pulse" : "bg-red-600"
            } `}
          ></span>
        </div>
      </div>
      {/* settting------------------------------------------------------ */}
      <div className="fixed top-4 right-4">
        <button onClick={togglePasswordModal}>
        <IoMdSettings className="w-8 h-8"/>
        </button>
      </div>
      {/* password modal */}
      {isPasswordModalOpen && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={togglePasswordModal}
      >
        <div
          className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold mb-4">Enter Password</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            placeholder="Password"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={togglePasswordModal}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )}
       {/* setting Modal */}
    {isModalOpen && (
      <div
className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
onClick={toggleModal} // Close modal when clicking on the backdrop
>
<div
  className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md"
  onClick={(e) => e.stopPropagation()} // Prevent event propagation to backdrop
>
  <h2 className="text-2xl font-bold mb-4">Settings</h2>
  <form className="space-y-4">
  <div>
  <label htmlFor="heading" className="block text-md text-gray-700">Heading</label>
  <input
    type="text"
    id="heading"
    name="heading"
    value={formData.heading}
    onChange={handleChange}
    className="w-full p-2 border rounded"
  />
</div>
<div>
  <label htmlFor="ip_address" className="block text-md text-gray-700">IP ADDRESS</label>
  <input
    type="text"
    id="ip_address"
    name="ip_address"
    value={formData.ip_address}
    onChange={handleChange}
    className="w-full p-2 border rounded"
  />
</div>

<div>
  <label htmlFor="auto_register" className="block text-md text-gray-700">Auto Register</label>
  <input
    type="text"
    id="auto_register"
    name="auto_register"
    value={formData.auto_register}
    onChange={handleChange}
    className="w-full p-2 border rounded"
  />
</div>

<div>
  <label htmlFor="manual_register" className="block text-md text-gray-700">Manual Register</label>
  <input
    type="text"
    id="manual_register"
    name="manual_register"
    value={formData.manual_register}
    onChange={handleChange}
    className="w-full p-2 border rounded"
  />
</div>

<div>
  <label htmlFor="connection_register" className="block text-md text-gray-700">Connection Register</label>
  <input
    type="text"
    id="connection_register"
    name="connection_register"
    value={formData.connection_register}
    onChange={handleChange}
    className="w-full p-2 border rounded"
  />
</div>

<div>
  <label htmlFor="mode_register" className="block text-md text-gray-700">Mode Register</label>
  <input
    type="text"
    id="mode_register"
    name="mode_register"
    value={formData.mode_register}
    onChange={handleChange}
    className="w-full p-2 border rounded"
  />
</div>
</form>

  <div className="flex justify-end mt-4 space-x-2">
    <button
      onClick={toggleModal}
      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
    >
      Cancel
    </button>
    <button
      onClick={handleSubmit}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Submit
    </button>
  </div>
</div>
</div>
    )}
  
    </div>
  );
}

export default App;