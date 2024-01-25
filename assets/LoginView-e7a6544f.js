import{X as x,Y as S,Z as B,a0 as k,a2 as C,a3 as t,ab as y,c as e,a7 as a,ao as F,ap as i,J as M,a8 as N,an as U}from"./index-18fec4bc.js";import{c as q,a as m,u as P,d,V as R}from"./index.esm-82058412.js";import{V as T}from"./VContainer-3d669d2c.js";import{V as p}from"./VCol-049e7cb7.js";import{V as $}from"./VDivider-bde109a0.js";import{V as A}from"./VRow-c4f2e625.js";const D=U("h1",null,"登入",-1),E={__name:"LoginView",setup(J){const{api:V}=y(),f=x(),c=S(),g=B(),b=q({account:m().required("帳號為必填欄位").min(4,"使用者帳號長度不符").max(20,"使用者帳號長度不符"),password:m().required("密碼為必填欄位").min(4,"密碼長度不符").max(20,"密碼長度不符")}),{handleSubmit:w,isSubitting:h}=P({validationSchema:b}),l=d("account"),n=d("password"),v=w(async u=>{var s,o;try{const{data:r}=await V.post("/users/login",{account:u.account,password:u.password});g.login(r.result),c({text:"登入成功",showCloseButton:!1,snackbarProps:{timeout:2e3,color:"green",location:"bottom"}}),f.push("/")}catch(r){const _=((o=(s=r==null?void 0:r.response)==null?void 0:s.data)==null?void 0:o.message)||"發生錯誤，請稍後再試";c({text:_,showCloseButton:!1,snackbarProps:{timeout:2e3,console:"red",location:"bottom"}})}});return(u,s)=>(k(),C(T,null,{default:t(()=>[e(A,null,{default:t(()=>[e(p,{cols:"12"},{default:t(()=>[D]),_:1}),e($),e(p,{cols:"12"},{default:t(()=>[e(R,{disabled:a(h),onSubmit:F(a(v),["prevent"])},{default:t(()=>[e(i,{label:"帳號",maxlength:"20",minlength:"4",counter:"",modelValue:a(l).value.value,"onUpdate:modelValue":s[0]||(s[0]=o=>a(l).value.value=o),"error-messages":a(l).errorMessage.value},null,8,["modelValue","error-messages"]),e(i,{label:"密碼",maxlength:"20",minlength:"4",counter:"",type:"password",modelValue:a(n).value.value,"onUpdate:modelValue":s[1]||(s[1]=o=>a(n).value.value=o),"error-messages":a(n).errorMessage.value},null,8,["modelValue","error-messages"]),e(M,{type:"submit",color:"green"},{default:t(()=>[N("登入")]),_:1})]),_:1},8,["disabled","onSubmit"])]),_:1})]),_:1})]),_:1}))}};export{E as default};