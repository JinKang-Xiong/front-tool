import { computed,ref,onMounted } from "vue";
import {parseTime,formatTime} from '../../utils'
import { useclientStore } from '../../../../stores/count.js'

export default (options)=>{
      
    //是否正在计时
    let counting=false

    
    //剩余时间
    let remain=ref(options.time)
  
    //结束时间
    const endTime=ref(0)

    //格式化输出的日期时间
    const currentTime=computed(()=>formatTime(options.format,parseTime(remain.value)))
    
    //获取当前时间
    const getCurrentRemain=()=>Math.max(endTime.value-Date.now(),0)

    //获取当前剩余时间
    const setRmain=(value)=>{
       
        //更新剩余时间
        remain.value=value
        console.log(remain.value);
        localStorage.setItem('countDownTime',remain.value)
        //4481874620——007007
        // console.log("--------当前剩余时间---------");
        
        // console.log(remain.value);
        // console.log(currentTime.value)
        // console.log('-------------')

        if(value===0){

            if (options && typeof options.onFinish === 'function') {
                options.onFinish();
            }
            counting=false

        }
    }

    //倒计时
    const tickTime=()=>{
        requestAnimationFrame(()=>{
            
            setRmain(getCurrentRemain())

            //倒计时没结束
            if(remain.value>0){
                tickTime()
            }
        })
    }

    //启动
    const start=()=>{
        if(counting) return
        counting=true

        endTime.value=Date.now()+remain.value
        

        tickTime()
    }

    return{
        currentTime,
        start
    }

}