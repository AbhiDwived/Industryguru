
export default function formValidation(event) {
    var {name, value} = event.target
    switch(name){
     case "name":
     case "color":
     case "profile":
           if(value.length === 0)
                return name + " must required"
           else if (value.length < 3)
                return name + " must contain atleast 3 character"
           else if (value.length > 50)
                return name + " must contain less than 50 character"
           else 
               return "" 
 
     case "size":
           if(value.length === 0)
              return name + " must required"
           else if (value.length > 10)
              return name + " must contain less than 10 character"
           else 
              return "" 
 
      case "baseprice":
         if(!value )
            return name + " must required"
         else if(value<1)
            return name + " Price Must be Greater Than 0"
         else
            return ""
 
     case "discount":
         if(value < 0 && value > 100)
           return name + " Discount Must be Greater Than or Equal to 0 And Less Than 100"
          else
             return ""
     
     case "message":
          if(value.length === 0)
             return name + " must required"
           else if (value.length < 110 )
              return name + " must contain atleast 110 character"
            else 
               return ""
 
    }
 }
 