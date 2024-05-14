import { defineStore } from "pinia";
export const useCountStore= defineStore('counter',{
    state:()=>{
        return{
            count:0,
            userlogin:{},
            userlist:[],
            validatechek:''
        }
    },
    getters:{
        double:(state)=>state.count*2
    },
    actions:{
        increment(){
            this.count++
        }
    }
})

export const useclientStore= defineStore('client',{
    state:()=>{
        return{
          countDownTime:null,
          clientlogin:{}
        }
    },
    getters:{
        double:(state)=>state.count*2
    },
    actions:{
        increment(){
            this.count++
        }
    }
})