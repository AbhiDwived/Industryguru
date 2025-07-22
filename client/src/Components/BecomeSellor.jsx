import React, { useState,useEffect } from "react";
import { Link, useNavigate, } from "react-router-dom";
import { apiLink } from "../utils/utils";

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];
const categories = []

export default function BecomeSeller() {
  const [data, setData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
    role: "Vendor",
    company: "",
    state: "",
    category: "",
    pan: "",
    gst: "",
  });

    const [category, setCategory] = useState([])
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      let response = await fetch(`${apiLink}/api/categories`);
      response = await response.json()
      if(response.success){
        setCategory(response.category)
      }
    }
    fetchCategories()
  }, [])

  function getInputData(e) {
    const { name, value } = e.target;
    setData((old) => ({
      ...old,
      [name]: value,
    }));
  }

  async function sendOtp(e) {
    e.preventDefault();
    if (data.password === data.cpassword) {
      let response = await fetch(`${apiLink}/api/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email, phone: data.phone }),
      });
      response = await response.json();
      if (response.success) {
        setOtpSent(true);
        alert("OTP sent successfully!");
      } else {
        alert(response.message);
      }
    } else {
      alert("Password and Confirm Password Don't Match!");
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    let response = await fetch(`${apiLink}/api/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: data.email, otp }),
    });
    response = await response.json();
    if (response.success) {
      await registerVendor();
    } else {
      alert("Invalid OTP!");
    }
  }
  

  async function registerVendor() {
    let response = await fetch(`${apiLink}/api/vendor/register`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    response = await response.json();
    if (response.result === "Done") navigate("/login");
    else alert(response.message);
  }

  return (
    <div className="container-fluid my-3">
      <div className="w-75 m-auto">
        <h5 className="header-color text-center p-2">
          <span className="text-info">Become</span> a Seller
        </h5>
        {!otpSent ? (
          <form onSubmit={sendOtp}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>  Name</label>
                <input type="text" required onChange={getInputData} name="name" placeholder="First Name" className="form-control" />
              </div>
              <div className="col-md-6">
                <label> Username</label>
                <input type="text" required onChange={getInputData} name="username" placeholder="Last Name" className="form-control" />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Email</label>
                <input type="email" required onChange={getInputData} name="email" placeholder="Enter Email Address" className="form-control" />
              </div>
              <div className="col-md-6">
                <label>Phone No.</label>
                <input type="text" required onChange={getInputData} name="phone" placeholder="Enter Phone Number" className="form-control" />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Company Name</label>
                <input type="text" required onChange={getInputData} name="company" placeholder="Enter Company Name" className="form-control" />
              </div>
              <div className="col-md-6">
                <label>State</label>
                {/* <input type="text" required onChange={getInputData} name="phone" placeholder="Select State" className="form-control" /> */}
                <select name="state" className="form-control" required onChange={getInputData}>
                  <option value="">Select State</option>
                  {states.map((state)=>(
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Select Category</label>
                {/* <input type="email" required onChange={getInputData} name="email" placeholder="Select Caotogory" className="form-control" /> */}
                <select name="category" className="form-control"  onChange={getInputData}>
                  <option value="">Select Category</option>
                  {categories.map((category)=>(
                    <option key={category._id}value={category.name}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label>Pan No.</label>
                <input type="text" required onChange={getInputData} name="Pan No." placeholder="Enter Pan Number" className="form-control" />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label>Password</label>
                <input type="password" required onChange={getInputData} name="password" placeholder="Enter Password" className="form-control" />
              </div>
              <div className="col-md-6">
                <label>Confirm Password</label>
                <input type="password" required onChange={getInputData} name="cpassword" placeholder="Confirm Password" className="form-control" />
              </div>
              <div className="col-md-6">
                <label>GST No.</label>
                <input type="password" required onChange={getInputData} name="GST No." placeholder=" Enter GST Number" className="form-control" />
              </div>
            </div>
            <div className="mb-3">
              <button type="submit" className="btn main-color w-100">Send OTP</button>
            </div>
          </form>
        ) : (
          <form onSubmit={verifyOtp}>
            <div className="mb-3">
              <label>Enter OTP</label>
              <input type="text" required onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="form-control" />
            </div>
            <div className="mb-3">
              <button type="submit" className="btn main-color w-100">Verify OTP & Register</button>
            </div>
          </form>
        )}
        <Link to="/login" className="text-info">Already Vendor? Login to Your Account</Link>
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { apiLink } from "../utils/utils";

// const states = [
//   "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
//   "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
//   "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
//   "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
//   "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
//   "Uttar Pradesh", "Uttarakhand", "West Bengal"
// ];

// export default function BecomeSeller() {
//   const [data, setData] = useState({
//     name: "",
//     username: "",
//     email: "",
//     phone: "",
//     password: "",
//     cpassword: "",
//     role: "vendor",
//     company: "",
//     state: "",
//     category: "",
//     pan: "",
//     gst: "",
//   });

//   const [categories, setCategories] = useState([]);
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function fetchCategories() {
//       try {
//         let res = await fetch(`${apiLink}/api/categories`);
//         let json = await res.json();
//         if (json.success) {
//           setCategories(json.category);
//         }
//       } catch (err) {
//         console.error("Failed to load categories");
//       }
//     }
//     fetchCategories();
//   }, []);

//   function getInputData(e) {
//     const { name, value } = e.target;
//     setData((prev) => ({ ...prev, [name]: value }));
//   }

//   async function sendOtp(e) {
//     e.preventDefault();
//     if (data.password !== data.cpassword) {
//       return alert("Password and Confirm Password Don't Match!");
//     }

//     try {
//       let res = await fetch(`${apiLink}/api/send-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: data.email, phone: data.phone }),
//       });

//       let json = await res.json();
//       if (json.success) {
//         setOtpSent(true);
//         alert("OTP sent successfully!");
//       } else {
//         alert(json.message);
//       }
//     } catch (err) {
//       alert("OTP request failed");
//     }
//   }

//   async function verifyOtp(e) {
//     e.preventDefault();
//     try {
//       let res = await fetch(`${apiLink}/api/verify-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: data.email, otp }),
//       });

//       let json = await res.json();
//       console.log("OTP Verify response",json)
//       if (json.success) {
//         navigate('/vendor/register')
       
//       } else {
//         alert(json.message || "Invalid OTP!");
//       }
//     } catch (err) {
//       alert("OTP verification failed");
//     }
//   }

  // async function registerUser() {
  //   try {
  //     let res = await fetch(`${apiLink}/api/vendor/register`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(data),
  //     });

  //     let json = await res.json();
  //     console.log("Register response",json)
  //     // if (json.result === "Done") {
  //     //   alert("Seller registration successful. Awaiting admin approval");
  //     //   navigate("/login");
  //     // } else {
  //     //   alert(json.message, "Not Register");
  //     // }
  //     if (json.success) {
  //       alert("Vendor registration successful");
  //       navigate("/login");
  //     } else {
  //       alert(json.message || "Registration failed. Not registered.");
  //     }
  //   } catch (err) {
  //     alert("Registration failed");
  //   }
  // }

//   return (
//     <div className="container-fluid my-3">
//       <div className="w-75 m-auto">
//         <h5 className="header-color text-center p-2">
//           <span className="text-info">Become</span> a Seller
//         </h5>

//         {!otpSent ? (
//           <form onSubmit={sendOtp}>
//             <div className="row mb-3">
//               <div className="col-md-6">
//                 <label>Name</label>
//                 <input type="text" required name="name" onChange={getInputData} className="form-control" />
//               </div>
//               <div className="col-md-6">
//                 <label>Username</label>
//                 <input type="text" required name="username" onChange={getInputData} className="form-control" />
//               </div>
//             </div>

//             <div className="row mb-3">
//               <div className="col-md-6">
//                 <label>Email</label>
//                 <input type="email" required name="email" onChange={getInputData} className="form-control" />
//               </div>
//               <div className="col-md-6">
//                 <label>Phone No.</label>
//                 <input type="text" required name="phone" onChange={getInputData} className="form-control" />
//               </div>
//             </div>

//             <div className="row mb-3">
//               <div className="col-md-6">
//                 <label>Company Name</label>
//                 <input type="text" required name="company" onChange={getInputData} className="form-control" />
//               </div>
//               <div className="col-md-6">
//                 <label>State</label>
//                 <select name="state" required onChange={getInputData} className="form-control">
//                   <option value="">Select State</option>
//                   {states.map((state) => (
//                     <option key={state} value={state}>{state}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="row mb-3">
//               <div className="col-md-6">
//                 <label>Category</label>
//                 <select name="category"  onChange={getInputData} className="form-control">
//                   <option value="">Select Category</option>
//                   {categories.map((cat) => (
//                     <option key={cat._id} value={cat.name}>{cat.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="col-md-6">
//                 <label>Pan No.</label>
//                 <input type="text" required name="pan" onChange={getInputData} className="form-control" />
//               </div>
//             </div>

//             <div className="row mb-3">
//               <div className="col-md-6">
//                 <label>Password</label>
//                 <input type="password" required name="password" onChange={getInputData} className="form-control" />
//               </div>
//               <div className="col-md-6">
//                 <label>Confirm Password</label>
//                 <input type="password" required name="cpassword" onChange={getInputData} className="form-control" />
//               </div>
//             </div>

//             <div className="row mb-3">
//               <div className="col-md-6">
//                 <label>GST No.</label>
//                 <input type="text" required name="gst" onChange={getInputData} className="form-control" />
//               </div>
//             </div>

//             <div className="mb-3">
//               <button type="submit" className="btn main-color w-100">Send OTP</button>
//             </div>
//           </form>
//         ) : (
//           <form onSubmit={verifyOtp}>
//             <div className="mb-3">
//               <label>Enter OTP</label>
//               <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="form-control" />
//             </div>
//             <div className="mb-3">
//               <button type="submit" className="btn main-color w-100">Verify OTP & Register</button>
//             </div>
//           </form>
//         )}

//         <Link to="/vendor/register" className="text-info">Already Vendor? Login to Your Account</Link>
//       </div>
//     </div>
//   );
// }

