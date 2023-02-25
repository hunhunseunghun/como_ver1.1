import react,{useState,useEffect} from "react"


const Alram = (tickers) => {

const [isAlarmselected, setIsAlarmselected] = useState(false)


useEffect(()=>{

},[])



return (
    <div className={`alarm ${isAlarmselected? tickers+"AlarmOn": ""}`}></div>
)






}

export default Alram