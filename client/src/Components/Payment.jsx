// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate } from "react-router-dom";
// import { getCheckoutUser } from "../Store/ActionCreators/CheckoutActionCreators";
// import { apiLink } from "../utils/utils";

// export default function Payment() {
//   var [checkout, setcheckout] = useState({});
//   var [user, setuser] = useState({});
//   var navigate = useNavigate();
//   var { _id } = useParams();
//   var dispatch = useDispatch();
//   var allCheckouts = useSelector((state) => state.CheckoutStateData);

//   async function getData() {
//     dispatch(getCheckoutUser());
//     var result;
//     if (_id === "-1") result = allCheckouts[0];
//     else result = allCheckouts.find((item) => item._id === _id);

//     setcheckout(result);

//     var response = await fetch(
//       `${apiLink}/api/user/` + localStorage.getItem("userid"),
//       {
//         method: "get",
//         headers: {
//           authorization: localStorage.getItem("token"),
//         },
//       }
//     );
//     response = await response.json();
//     setuser(response.data);
//   }
//   useEffect(() => {
//     getData();
//     // eslint-disable-next-line
//   }, [allCheckouts.length]);
//   const initPayment = (data) => {
//     const options = {
//       key: "rzp_test_kJFCr5jnzPYy9s", // Enter the Key ID generated from the Dashboard
//       amount: data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
//       currency: "INR",
//       order_id: data._id, //This is a sample Order ID. Pass the `id` obtained in the response of createOrder().
//       prefill: {
//         name: user.name,
//         email: user.email,
//         contact: user.phone,
//       },
//       handler: async (razorpayResponse) => {
//         try {
//           var item = {
//             razorpay_payment_id: razorpayResponse.razorpay_payment_id,
//             checkid: checkout._id,
//           };

//           var verifyResponse = await fetch(`${apiLink}/api/checkout/verify`, {
//             method: "post",
//             headers: {
//               "content-type": "application/json",
//               authorization: localStorage.getItem("token"),
//             },
//             body: JSON.stringify(item),
//           });

//           var verifyResult = await verifyResponse.json(); // Parse the verifyResponse
//           if (verifyResult.result === "Done") {
//             navigate("/confirmation");
//           } else {
//             alert(verifyResult.message);
//           }
//         } catch (error) {
//           console.log(error);
//         }
//       },
//       theme: {
//         color: "#3399cc",
//       },
//     };

//     // const rzp1 = new Razorpay(options);

//     // rzp1.open();
//   };
//   const handlePayment = async () => {
//     try {
//       var response = await fetch(`${apiLink}/api/checkout/order`, {
//         method: "post",
//         headers: {
//           "Content-Type": "application/json",
//           authorization: localStorage.getItem("token"),
//         },
//         body: JSON.stringify({ amount: checkout.total }),
//       });
//       response = await response.json();
//       if (response.result === "Done") initPayment(response.data);
//       else alert(response.message);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <>
//       <div className="container my-5">
//         <button
//           onClick={handlePayment}
//           className="btn btn-primary w-100 m-auto"
//         >
//           Pay with Razorpay
//         </button>
//       </div>
//     </>
//   );
// }



import React, { useEffect, useState } from "react";
// import useRazorpay from "react-razorpay";
// import Razorpay from 'react-razorpay';
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getCheckoutUser } from "../Store/ActionCreators/CheckoutActionCreators";
import { apiLink } from "../utils/utils";

export default function Payment() {
  var [checkout, setcheckout] = useState({});
  var [loading, setLoading] = useState(false);
  var [user, setuser] = useState({});
  // const [Razorpay] = useRazorpay();
  var navigate = useNavigate();
  var { _id } = useParams();
  var dispatch = useDispatch();
  var allCheckouts = useSelector((state) => state.CheckoutStateData);

  async function getData() {
    dispatch(getCheckoutUser());
    var result;
    if (_id === "-1") result = allCheckouts[0];
    else result = allCheckouts.find((item) => item._id === _id);

    setcheckout(result);

    var response = await fetch(
      `${apiLink}/api/user/` + localStorage.getItem("userid"),
      {
        method: "get",
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );
    response = await response.json();
    setuser(response.data);
  }
  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [allCheckouts.length]);

      const initPayment = async(data) => {
        const {subtotal,total,shipping,userid } = checkout||{};
        const payload={...checkout}
        delete payload._id
       console.log(checkout,subtotal,total,shipping,userid)
       try{
         
        setLoading(true)
        const res=await fetch(`${apiLink}/api/payment`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
        }
        )
          const data=await res.json()
          console.log(data)
          // const {}
          if(data?.http?.statusCode!==200){
            console.log(data)
            return  alert(data?.http?.statusMessage) 
          }
          
            const {payment_links}=data||{}
            if(payment_links){
              window.open(payment_links?.web, "_blank");
            }
            console.log(data)   
       
       }catch(error){
           console.log(error)
           alert(error?.message)
       }finally{
          setLoading(false)
       }
    
    }
  
  
  
  const handlePayment = async () => {
    console.log("checkout data",checkout)
    try {
      var response = await fetch(`${apiLink}/api/checkout/order`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ amount: checkout.total }),
      });
      response = await response.json();
      if (response.result === "Done") initPayment(response.data);
      else alert(response.message);
    } catch (error) {
      console.log(error);
    }
  };

 
  
  return (
    <>
      <div className="container my-5">
        <button
          onClick={handlePayment}
          className="btn btn-primary w-100 m-auto"
          disabled={loading}
        >
          {loading?"Processing...":"Pay with HDFC Smartgateway"}
        </button>
      </div>
    </>
  );
}