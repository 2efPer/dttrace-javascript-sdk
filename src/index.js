import Option from './module/option';
import Param from './module/param';
import send from './module/send';
import initialize from './module/initialize';
import {
  eventInfoAnalyze
} from './module/event';
import cookie from './utils/cookie';

function carryRocket(eventId,fun,params){
  if(typeof eventId === 'number'){
    if(typeof fun === 'function'){
      return function(){
        const final_event = window.event ? window.event : arguments[0];
        const result=fun.apply(this,arguments);
        send(Object.assign({
          $event_id:eventId
        }, eventInfoAnalyze(final_event),params,result))
      }
    }else{
      console.error(new Error("the second param in Dttrace.carryRocket must be function"));
    }
  }else{
    console.error(new Error("the first param in Dttrace.carryRocket must be number"));
  }
}

//DtaRocket注解
function DttraceRocket(eventId,params) {
  if(typeof eventId === 'number'){
    const final_params=Object.assign({
      $event_id:eventId
    },params);
    return (target, name, descriptor) => { 
      target[name]=carryRocket(eventId,target[name],final_params);
      return target;
    }
  }else{
    console.error(new Error("the first param in @DttraceRocket must be number"));
  }
}

// 初始化
const init = (args) => {
  const {
    appKey,
    getSessionId,
    getUserId,
    sessionExpiration,
    serverUrl,
    debug,
    params
  } = args;

  try{
    if (!appKey) throw new Error('appKey no exist');
  }catch(err){
    Option.set({status:0});
    console.error(err);
  }

  if(Option.get('status')){
    let final_option={
      appKey,
      getSessionId,
      getUserId,
      debug
    }
    if(typeof debug === 'boolean') Object.assign(final_option,{debug});
    if(typeof sessionExpiration === 'number') Object.assign(final_option,{session_expiration:sessionExpiration});
    if(typeof serverUrl === 'string') Object.assign(final_option,{server_url:serverUrl});
    if(typeof getSessionId === 'function') Object.assign(final_option,{getSessionId});
    if(typeof getUserId === 'function') Object.assign(final_option,{getUserId});

    Option.set(final_option);
    Param.set(params);
    //初始化
    initialize();
  }
}

function launchRocket(eventId,params,event){
  if(typeof eventId === 'number'){
    const final_params= Object.assign({
      $event_id:eventId
    },params);
    if(event){
      Object.assign(final_params,eventInfoAnalyze(event));
    }
    send(final_params);
  }else{
    console.error(new Error("the first param in Dttrace.launchRocket must be number"));
  }
}


const Dttrace={
  init,
  launchRocket,
  carryRocket,
  DttraceRocket,
  cookie,
  Param
}

export default Dttrace;